import React, { FC, useState } from 'react'
import {
    LayoutAnimation,
    NativeModules,
    Platform,
    ViewProps,
} from 'react-native'
import {
    HoverUpdateContext,
    DropsContext,
    hoverRef,
} from '../contexts/DragContextProvider'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import {
    ExpectedChoiceContext,
    OnCorrectChoiceContext,
    GetGlyphContext,
} from '../contexts/ChallengeContextProvider'
import GlyphHint from './GlyphHint'
import { DropInfo, MeasureType } from '../types/dropInfo'
import { AddHealthContext } from '../contexts/HealthContextProvider'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { useContext } from '../utils/react'
import { ContinueAnimInstantResetContext } from '../contexts/TaskAnimContextProvider'

const { UIManager } = NativeModules

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
}

type Props = {
    anchor?: MeasureType // Default position / size
    children?: React.ReactNode
    glyph?: string
    isCorrectAnswer?: boolean
    width: number
    setIsBeingDragged: (bool: boolean) => void
    isBeingDragged: boolean
} & ViewProps

type Size = {
    height: number
    width: number
}

/** Makes children draggable. */
const Draggable: FC<Props> = ({
    children,
    anchor,
    width,
    glyph,
    isCorrectAnswer,
    setIsBeingDragged,
    isBeingDragged,
    // ...props
}) => {
    const hoverUpdate = useContext(HoverUpdateContext)
    const drops = useContext(DropsContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const getGlyph = useContext(GetGlyphContext)
    const addHealth = useContext(AddHealthContext)
    const animation = useContext(ContinueAnimInstantResetContext)

    const [droppedBefore, setDroppedBefore] = useState(false)

    let transX = useSharedValue(0)
    let transY = useSharedValue(0)
    let scale = useSharedValue(1)

    // console.log(
    //   "rerender dragable",
    //   glyph,
    //   drops.map((drop) => drop.glyph)
    // );

    // const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
    const [currSize, setCurrentSize] = useState<Size>() // Set current size of the draggable
    const [dragStartTran, setDragStartTran] = useState({ x: 0, y: 0 }) // What translation did it had at drag start.
    const [dragStartSize, setDragStartSize] = useState({
        height: width,
        width: width,
    }) // What size did it had at drag start.

    const dropSuccessful = (hover: DropInfo, anchor: MeasureType) => {
        onCorrectChoice?.()
        const newSize = {
            width: hover.width,
            height: hover.height,
        }
        const newTrans = {
            x: hover.x - anchor.x,
            y: hover.y - anchor.y,
        }
        if (
            currSize?.height !== newSize.height &&
            currSize?.width !== newSize.width
        ) {
            setCurrentSize(newSize)
            setDragStartSize(newSize)
        }
        moveTo(newTrans)
        setDroppedBefore(true)
    }

    const dropCancelled = () => {
        moveTo(dragStartTran)
        if (
            anchor &&
            currSize?.height !== dragStartSize.height &&
            currSize?.width !== dragStartSize.width
        ) {
            setCurrentSize({
                width: dragStartSize.width,
                height: dragStartSize.height,
            })
        }
    }

    const prepForLayout = () =>
        LayoutAnimation.configureNext({
            duration: 300,
            update: { type: 'spring', springDamping: 1 },
        })

    /** TAP - Memod as requested in documentation*/
    const tap = React.useMemo(
        () =>
            Gesture.Tap()
                .runOnJS(true)
                .onEnd(() => {
                    prepForLayout()
                    const dropInfo = drops.find((info) => info.glyph === glyph)
                    if (anchor && expectedChoice === glyph && dropInfo) {
                        dropSuccessful(dropInfo, anchor)
                    }
                    setIsBeingDragged(false)
                }),
        [anchor, drops, expectedChoice, glyph, prepForLayout]
    )

    /** DRAG */
    const drag = React.useMemo(
        () =>
            Gesture.Pan()
                .runOnJS(true)
                .onBegin(() => {
                    setIsBeingDragged(true)
                    currSize && setDragStartSize(currSize)
                })
                .onChange((drag) => {
                    hoverUpdate?.({ x: drag.absoluteX, y: drag.absoluteY })
                    let tx = drag.translationX
                    let ty = drag.translationY

                    // Respond to drag, but "don't let them move it"
                    if (droppedBefore) {
                        tx =
                            tx < 0
                                ? -Math.log2(Math.abs(tx / 20 - 1)) * 5 - 1
                                : Math.log2(Math.abs(tx / 20 + 1)) * 5 + 1
                        ty =
                            ty < 0
                                ? -Math.log2(Math.abs(ty / 20 - 1)) * 5 - 1
                                : Math.log2(Math.abs(ty / 20 + 1)) * 5 + 1
                    }
                    transX.value = dragStartTran.x + tx
                    transY.value = dragStartTran.y + ty
                })
                .onEnd(() => {
                    setIsBeingDragged(false)
                    prepForLayout()

                    // Drop successful
                    const hover = hoverRef
                    if (
                        !droppedBefore && // Not dropped already
                        hover &&
                        hover.glyph === glyph && // currently hovering over droplocation with the right glyph
                        anchor &&
                        expectedChoice === glyph // Is this glyph the right input
                    ) {
                        dropSuccessful(hover, anchor)
                    }
                    // Drop user error
                    else if (!droppedBefore && hover) {
                        console.log('failed', droppedBefore)
                        addHealth(-10)
                        dropCancelled()
                    }
                    // Drop cancelled.
                    else {
                        dropCancelled()
                    }
                    hoverUpdate?.()
                })
                .onFinalize(() => {
                    setIsBeingDragged(false)
                }),
        [
            hoverUpdate,
            transX,
            transY,
            dragStartTran,
            currSize,
            anchor,
            expectedChoice,
            prepForLayout,
            setCurrentSize,
            setIsBeingDragged,
            droppedBefore,
        ]
    )

    const composed = Gesture.Exclusive(tap, drag)

    // Move to new default position
    const moveTo = (newpan: { x: number; y: number }) => {
        const springConf = { mass: 1, damping: 23, stiffness: 253 }
        transX.value = withSpring(newpan.x, springConf)
        transY.value = withSpring(newpan.y, springConf)
        if (dragStartTran.x !== newpan.x && dragStartTran.y !== newpan.y)
            setDragStartTran(newpan)
    }

    scale.value = withTiming(isBeingDragged ? 1.2 : 1, { duration: 50 })

    return (
        <GestureDetector gesture={drag}>
            <Animated.View
                id="animate_position"
                className="absolute"
                style={{
                    transform: [
                        { translateX: transX },
                        { translateY: transY },
                        { scale: scale },
                    ],
                    zIndex: isBeingDragged ? 10 : 1,
                    elevation: isBeingDragged ? 10 : 1,
                    height: currSize ? currSize.height : width,
                    width: currSize ? currSize.width : width,
                }}
            >
                <Animated.View
                    className="flex-grow"
                    style={
                        isCorrectAnswer
                            ? useAnimatedStyle(() => ({
                                  opacity: interpolate(
                                      animation.value,
                                      [-1, 0, 1],
                                      [1, 1, 0],
                                      Extrapolation.EXTEND
                                  ),
                                  //   transform: [
                                  //       {
                                  //           scale: interpolate(
                                  //               animation.value,
                                  //               [-1, 0, 1],
                                  //               [1, 1.2, 0.5],
                                  //               Extrapolation.EXTEND
                                  //           ),
                                  //       },
                                  //   ],
                              }))
                            : {}
                    }
                >
                    {children}
                </Animated.View>
                <GlyphHint
                    anchor={{
                        height: currSize ? currSize.height : width,
                        width: currSize ? currSize.width : width,
                        left: 0,
                        top: 0,
                        x: 0,
                        y: 0,
                    }}
                    hintText={getGlyph?.(glyph)?.meanings?.primary ?? ''}
                    show={isBeingDragged}
                />
            </Animated.View>
        </GestureDetector>
    )
}

export default Draggable

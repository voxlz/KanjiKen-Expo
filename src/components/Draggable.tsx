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
import { Learnable } from '../types/progress'
import { glyphDict } from '../data/glyphDict'
import { DropsDispatchContext } from '../contexts/DragContextProvider'
import { GlyphWidthContext } from '../contexts/GlyphWidthContextProvider'
import { defaultGap } from '../utils/consts'

const { UIManager } = NativeModules

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
}

type Props = {
    anchor?: MeasureType // Default position / size
    children?: React.ReactNode
    glyph?: Learnable
    isCorrectAnswer?: boolean
    width: number
    setIsBeingDragged: (bool: boolean) => void
    isBeingDragged: boolean
    clickable: boolean
    hintOnDrag: boolean
} & ViewProps

type Size = {
    height: number
    width: number
}

export const structuredClone = (obj: object) => {
    return JSON.parse(JSON.stringify(obj))
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
    clickable = false,
    hintOnDrag = true,
    // ...props
}) => {
    const hoverUpdate = useContext(HoverUpdateContext)
    const drops = useContext(DropsContext)
    const dropsDispatch = useContext(DropsDispatchContext)
    const expectedChoice = useContext(ExpectedChoiceContext)
    const onCorrectChoice = useContext(OnCorrectChoiceContext)
    const addHealth = useContext(AddHealthContext)
    const glyphWidth = useContext(GlyphWidthContext)
    const animationInstantReset = useContext(ContinueAnimInstantResetContext)

    const transX = useSharedValue(0)
    const transY = useSharedValue(0)
    const scale = useSharedValue(1)

    // const [startBound, setStartBound] = useState<LayoutRectangle>(); // Remember initial size and position of this object
    // const [droppedBefore, setDroppedBefore] = useState(false)
    const [dragState, setDragState] = useState<{
        currentSize: Size | undefined
        dragStartTranslate: { x: number; y: number }
        dragStartSize: {
            height: number
            width: number
        }
        droppedBefore: boolean
    }>({
        currentSize: undefined,
        dragStartTranslate: { x: 0, y: 0 },
        dragStartSize: {
            height: width,
            width: width,
        },
        droppedBefore: false,
    })
    // const [currSize, setCurrentSize] = useState<Size>() // Set current size of the draggable
    // const [dragStartTran, setDragStartTran] = useState({ x: 0, y: 0 }) // What translation did it had at drag start.
    // const [dragStartSize, setDragStartSize] = useState({
    //     height: width,
    //     width: width,
    // }) // What size did it had at drag start.

    console.log('RERENDER')

    const dropSuccessful = (hover: DropInfo, anchor: MeasureType) => {
        console.log('INSIDE DROPSUCCESSFUL')
        const a = performance.now()
        onCorrectChoice?.()
        const b = performance.now()
        const newSize = {
            width: hover.width,
            height: hover.height,
        }
        const newTrans = {
            x: hover.x - anchor.x,
            y: hover.y - anchor.y,
        }
        const c = performance.now()

        let d
        let f

        const newDragState = structuredClone(dragState)

        if (
            dragState.currentSize?.height !== newSize.height &&
            dragState.currentSize?.width !== newSize.width
        ) {
            console.log('About to set Current')
            newDragState.currentSize = newSize
            d = performance.now()

            newDragState.dragStartSize = newSize
            f = performance.now()
        }
        moveTo(newTrans)
        const g = performance.now()

        newDragState.droppedBefore = true
        setDragState(newDragState)
        const h = performance.now()

        // Update containsGlyph in dropLocation
        hover.containsGlyph = glyph
        dropsDispatch({ type: 'changed', dropInfo: hover })
        const i = performance.now()

        console.log('onCorrectChoice', b - a)
        console.log('newSize', c - b)
        console.log('setCurrentSize', d! - c)
        console.log('setDragStartSize', f! - d!)
        console.log('moveTo', g! - f!)
        console.log('setDroppedBefore', h! - g!)
        console.log('OUTSIDE')
    }

    const dropCancelled = () => {
        moveTo(dragState.dragStartTranslate)
        if (
            anchor &&
            dragState.currentSize?.height !== dragState.dragStartSize.height &&
            dragState.currentSize?.width !== dragState.dragStartSize.width
        ) {
            const newDragState = structuredClone(dragState)
            newDragState.currentSize = {
                width: dragState.dragStartSize.width,
                height: dragState.dragStartSize.height,
            }
            setDragState(newDragState)
        }
    }

    const prepForLayout = () =>
        LayoutAnimation.configureNext({
            duration: 300,
            update: { type: 'spring', springDamping: 1 },
        })

    /** TAP - Memo'd as recommended in documentation */
    const tap = React.useMemo(
        () =>
            Gesture.Tap()
                .maxDistance(10)
                .runOnJS(true)
                .onStart(() => {
                    console.log('click detected')
                    const a = performance.now()
                    prepForLayout()
                    const b = performance.now()
                    const dropInfo = drops.find((info) => info.glyph === glyph)
                    const c = performance.now()

                    if (anchor && expectedChoice === glyph && dropInfo) {
                        dropSuccessful(dropInfo, anchor)
                    }
                    const d = performance.now()

                    setIsBeingDragged(false)
                    const e = performance.now()

                    console.log('click complete: ', e - a + ' ms')
                    // console.log('prepForLayout complete: ', b - a + ' ms')
                    // console.log('dropInfo complete: ', c - b + ' ms')
                    // console.log('dropSuccessful complete: ', d - c + ' ms')
                    // console.log('setIsBeingDragged complete: ', e - d + ' ms')
                }),
        [anchor, drops, expectedChoice, glyph, prepForLayout]
    )

    /** DRAG - Memo'd as recommended in documentation*/
    const drag = React.useMemo(
        () =>
            Gesture.Pan()
                .runOnJS(true)
                .onBegin(() => {
                    setIsBeingDragged(true)
                    dragState.currentSize &&
                        setDragState((oldState) => {
                            const newState = structuredClone(oldState)
                            newState.dragStartSize = dragState.currentSize!
                            return newState
                            // setDragStartSize(currSize)
                        })
                })
                .onChange((drag) => {
                    // Since user might have started drag by dragging edge, check hover based on draggable center instead.
                    const center = glyphWidth / 2
                    const cxDiff = center - drag.x
                    const cyDiff = center - drag.y
                    hoverUpdate?.({
                        x: drag.absoluteX + cxDiff,
                        y: drag.absoluteY + cyDiff,
                    })

                    let tx = drag.translationX
                    let ty = drag.translationY

                    // Respond to drag, but "don't let them move it"
                    if (
                        dragState.droppedBefore ||
                        expectedChoice === 'FINISH'
                    ) {
                        tx =
                            tx < 0
                                ? -Math.log2(Math.abs(tx / 20 - 1)) * 5 - 1
                                : Math.log2(Math.abs(tx / 20 + 1)) * 5 + 1
                        ty =
                            ty < 0
                                ? -Math.log2(Math.abs(ty / 20 - 1)) * 5 - 1
                                : Math.log2(Math.abs(ty / 20 + 1)) * 5 + 1
                    }
                    transX.value = dragState.dragStartTranslate.x + tx
                    transY.value = dragState.dragStartTranslate.y + ty
                })
                .onEnd(() => {
                    setIsBeingDragged(false)
                    prepForLayout()

                    // Drop successful
                    const hover = hoverRef
                    if (
                        !dragState.droppedBefore && // Not dropped already
                        expectedChoice !== 'FINISH' && // not already finished
                        hover &&
                        hover.glyph === glyph && // currently hovering over droplocation with the right glyph
                        anchor &&
                        expectedChoice === glyph // Is this glyph the right input
                    ) {
                        dropSuccessful(hover, anchor)
                    }
                    // Drop user error
                    else if (
                        !dragState.droppedBefore &&
                        expectedChoice !== 'FINISH' && // not already finished
                        !hover?.containsGlyph &&
                        hover
                    ) {
                        console.log('failed', dragState.droppedBefore)
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
            anchor,
            expectedChoice,
            prepForLayout,
            setIsBeingDragged,
            dragState,
        ]
    )

    const composed = Gesture.Simultaneous(tap, drag)

    // Move to new default position
    const moveTo = (newpan: { x: number; y: number }) => {
        const springConf = { mass: 1, damping: 23, stiffness: 253 }
        transX.value = withSpring(newpan.x, springConf)
        transY.value = withSpring(newpan.y, springConf)
        if (
            dragState.dragStartTranslate.x !== newpan.x &&
            dragState.dragStartTranslate.y !== newpan.y
        ) {
            const newDragState = structuredClone(dragState)
            newDragState.dragStartTranslate = newpan
            setDragState(newDragState)
            // setDragStartTran(newpan)
        }
    }

    scale.value = withTiming(isBeingDragged ? 1.2 : 1, { duration: 50 })

    return (
        <GestureDetector gesture={composed}>
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
                    height: dragState.currentSize
                        ? dragState.currentSize.height
                        : width,
                    width: dragState.currentSize
                        ? dragState.currentSize.width
                        : width,
                }}
                hitSlop={{
                    top: defaultGap / 2,
                    bottom: defaultGap / 2,
                    left: defaultGap / 2,
                    right: defaultGap / 2,
                }}
            >
                <Animated.View
                    className="flex-grow"
                    style={
                        isCorrectAnswer
                            ? useAnimatedStyle(() => ({
                                  opacity: interpolate(
                                      animationInstantReset.value,
                                      [-1, 0, 1],
                                      [1, 1, 0],
                                      Extrapolation.EXTEND
                                  ),
                                  transform: [
                                      {
                                          scale: interpolate(
                                              animationInstantReset.value,
                                              [-1, 0, 1],
                                              [1, 1.2, 0.5],
                                              Extrapolation.EXTEND
                                          ),
                                      },
                                  ],
                              }))
                            : {}
                    }
                >
                    {children}
                </Animated.View>
                <GlyphHint
                    anchor={{
                        height: dragState.currentSize
                            ? dragState.currentSize.height
                            : width,
                        width: dragState.currentSize
                            ? dragState.currentSize.width
                            : width,
                        left: 0,
                        top: 0,
                        x: 0,
                        y: 0,
                    }}
                    hintText={
                        (glyph && glyphDict[glyph].meanings?.primary) ?? ''
                    }
                    show={hintOnDrag && isBeingDragged}
                />
            </Animated.View>
        </GestureDetector>
    )
}

export default Draggable

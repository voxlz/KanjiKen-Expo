import React, { FC, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import todo from '../../todo/TODO.md'
import todo_dict from '../../todo/TODO_DICT.md'
import { ScrollView } from 'react-native-gesture-handler'
import StyledButton from '../components/StyledButton'

type Props = { onDismiss: () => void }

type TodoType = {
    TODO: {
        Changelog: {
            [version: string]: {
                UpdateDesc?: {
                    raw: string
                }
                Internal?: {
                    raw: string
                }
                Features?: {
                    raw: string
                }
                Issues?: {
                    raw: string
                }
            }
        }
    }
}

type ChangeTableEntry = {
    [header in '#Id' | 'Prio' | 'Description']: string
}

type ChangeLog = [
    {
        version: string
        description: string
        features?: ChangeTableEntry[]
        issues?: ChangeTableEntry[]
        dictionary?: ChangeTableEntry[]
    }
]

const getTable = (strTable: string) =>
    require('mdtable2json').getTables(strTable)[0].json as ChangeTableEntry[]

/** Display the changelog */
const ChangeLog: FC<Props> = ({ onDismiss }) => {
    const [showChangelog, setShowChangelog] = useState(true)
    const [changeLog, setChangeLog] = useState<ChangeLog>()

    useEffect(() => {
        setChangeLog(undefined)
        const md2json = require('md-2-json')
        const expoTodo = md2json.parse(todo) as TodoType
        const dictTodo = md2json.parse(todo_dict) as TodoType

        setChangeLog(() => {
            const changelog = Object.entries(expoTodo.TODO.Changelog).map(
                ([key, value]) => {
                    const test = dictTodo.TODO.Changelog
                    const dictIssueStr = test[key]?.Issues?.raw

                    if (!dictIssueStr) {
                        console.warn(
                            'No fixed issues found for the dictionary files for this update. Forgot to add #### Issues? Version: ',
                            key
                        )
                    }

                    console.log(test[key], dictIssueStr, 'update changelog')

                    const version = {
                        version: key,
                        description: value.UpdateDesc?.raw,
                        features: value.Features
                            ? getTable(value.Features.raw)
                            : undefined,
                        issues: value.Issues
                            ? getTable(value.Issues.raw)
                            : undefined,
                        dictionary: dictIssueStr
                            ? getTable(dictIssueStr)
                            : undefined,
                    }
                    // console.log('changeLog', version)
                    return version
                }
            ) as ChangeLog
            return changelog
        })
    }, [todo_dict, todo])

    const BulletList: React.FC<{
        text: string
        entries: ChangeTableEntry[]
    }> = ({ text, entries }): React.ReactNode =>
        entries.length > 0 ? (
            <>
                <Text className="uppercase font-noto-black mb-2 mt-4 text-xs">
                    {text}
                </Text>
                {entries.map(({ Description }, i) => (
                    <View className="flex-row" key={i}>
                        <Text className="mb-2 mr-2">{`\u2022`}</Text>
                        <Text className="mb-2">{`${
                            Description
                                ? Description.replaceAll('\\n', '\n')
                                : ''
                        }`}</Text>
                    </View>
                ))}
            </>
        ) : (
            <></>
        )

    const HorRule: React.FC<{ opacity: number }> = ({ opacity }) => (
        <View
            style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                opacity,
            }}
            className="mt-4"
        />
    )
    return (
        <>
            {showChangelog && (
                <>
                    <View className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-25" />
                    <View
                        style={{ borderWidth: 0 }}
                        className="absolute bg-slate-100 top-16 bottom-12 left-5 right-5 z-20 rounded-xl justify-between border-forest-900"
                    >
                        <ScrollView className="p-6">
                            <Text className="text-xl font-noto-md">
                                Changelog
                            </Text>
                            <HorRule opacity={0.2} />
                            {changeLog?.map(
                                (
                                    {
                                        version,
                                        issues,
                                        features,
                                        dictionary,
                                        description,
                                    },
                                    i
                                ) => (
                                    <View key={i}>
                                        <Text className="font-noto-black mt-4 text-lg">
                                            {version}
                                        </Text>
                                        {description && (
                                            <>
                                                <Text className="uppercase font-noto-black mb-2 mt-4 text-xs">
                                                    Description
                                                </Text>
                                                <Text className="mb-2">{`${description
                                                    .replaceAll(/\n/g, '')
                                                    .trim()}`}</Text>
                                            </>
                                        )}
                                        <BulletList
                                            text="Features"
                                            entries={features ?? []}
                                        />
                                        <BulletList
                                            text="Bug Fixes"
                                            entries={issues ?? []}
                                        />
                                        <BulletList
                                            text="Dictionary"
                                            entries={dictionary ?? []}
                                        />
                                        <HorRule opacity={0.1} />
                                    </View>
                                )
                            )}
                            <HorRule opacity={0.1} />
                        </ScrollView>
                        <View className="p-6 pt-2">
                            <StyledButton
                                text="Dissmiss"
                                onPress={() =>
                                    onDismiss
                                        ? onDismiss()
                                        : setShowChangelog(false)
                                }
                            />
                        </View>
                    </View>
                </>
            )}
        </>
    )
}

export default ChangeLog

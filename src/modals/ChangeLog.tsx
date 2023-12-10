import React, { FC, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Button from '../components/Button'
import todo from '../../TODO.md'
import dictChanges from '../../../../KanjiKen-Dict/TODO.md'
import { ScrollView } from 'react-native-gesture-handler'

type Props = { onDismiss: () => void }

type TodoType = {
    TODO: {
        Changelog: {
            [version: string]: {
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
        const md2json = require('md-2-json')
        const json = md2json.parse(todo) as TodoType
        const dictJson = md2json.parse(dictChanges)

        setChangeLog(
            Object.entries(json.TODO.Changelog).map(([key, value]) => {
                const test = dictJson.TODO.Changelog
                const dictIssueStr = test[key]?.Issues?.raw
                return {
                    version: key,
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
            }) as ChangeLog
        )
        console.log('changeLog', changeLog)
    }, [])

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
                        <Text className="mb-2">{`${Description.replaceAll(
                            '\\n',
                            '\n'
                        )}`}</Text>
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
                                ({ version, issues, features, dictionary }) => (
                                    <View key={version}>
                                        <Text className="font-noto-black mt-4 text-lg">
                                            {version}
                                        </Text>
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
                        </ScrollView>
                        <View className="h-32 p-8">
                            <Button
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

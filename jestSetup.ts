jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('@react-native-firebase/app', () => {
    let Firebase = {
        analytics: jest.fn().mockReturnValue({ logEvent: jest.fn() }),
        messaging: jest.fn(() => {
            return {
                hasPermission: jest.fn(() => true),
                onTokenRefresh: jest.fn(),
                getToken: jest.fn(() => 'token'),
            }
        }),
        remoteConfig: jest.fn().mockReturnValue({
            fetchAndActivate: jest.fn().mockReturnValue(Promise.resolve()),
            fetch: jest.fn().mockReturnValue(Promise.resolve()),
            getAll: jest.fn().mockReturnValue({
                eva: { value: true },
                eva_hmg: { value: false },
            }),
        }),
        firestore: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
                doc: jest.fn().mockReturnValue({
                    collection: jest.fn().mockReturnValue({
                        doc: jest.fn().mockReturnValue({
                            collection: jest.fn().mockReturnValue({
                                doc: jest.fn().mockReturnValue({
                                    set: jest.fn(),
                                    get: jest.fn(),
                                }),
                            }),
                        }),
                    }),
                }),
            }),
        }),
    }
    return Firebase
})

// jest.mock('@react-native-firebase/remote-config', () => {})
// jest.mock('@react-native-firebase/analytics', () => {})
jest.mock('@react-native-firebase/firestore', () => ({
    collection: (colName: string) => 'Test',
}))
jest.mock('@react-native-firebase/auth', () => {})
jest.mock('@react-native-firebase/storage', () => {
})

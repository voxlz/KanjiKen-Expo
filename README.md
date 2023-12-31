# KanjiKen

The kanji app to end all other kanji apps.

## Installation

1. Install Node version manager (Windows): <https://github.com/coreybutler/nvm-windows/releases>
2. Restart VSCode
3. Install node and yarn:

    ```bash
    nvm install latest
    nvm use latest
    corepack enable
    yarn install
    ```

4. Init submodules

    ```bash
    git submodule update --init --recursive
    ```

## Development

For starting the expo client, run:

```bash
yarn start
```

### Development clients

We are using native code in this project, so development clients must be used to test on device. (Expo GO does not work with native plugins.)

#### iOS

```bash
eas login
eas device:create 
eas build --profile development --platform ios
```

#### Android

```bash
eas login
eas build --profile development --platform android
```

## Building

We use EAS to build the app. The following command should be used to build and publish the apps for testing.

```bash
eas build --profile production --platform all
```

## Debugging

To get debug logs

1. Enable debug mode on the android device
2. Enable usb debugging
3. Ensure device shows up when running "adb devices"

```bash
adb logcat "*:E"
```

When developing the KanjiKen-dict repo (/dict folder), use f5 to debug or control + f5 to run.

## Submitting

EAS allows for auto submissions. I've set this up for android builds for now. Use following command to push a build for testing

```bash
eas submit -p android --profile testing (--latest)
```

### iOS

Run the following when you want to submit a newly created build to appstore connect.

```bash
eas submit -p ios --profile testing --latest
```

## Admob

<https://ninza7.medium.com/monetize-your-react-native-expo-apps-with-google-admob-f12950a233a4>

If admob page does not load, disable adblock.

## Apple auth: I've used the following article

<https://medium.com/nerd-for-tech/apple-google-authentication-in-expo-apps-using-firebase-997125440032>

## Add new secrets to Expo

```bash
eas secret:delete (optionally delete it)
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json
```

## Google sign-in on Android

To get this to work I had to copy the SHA1 key into the Firebase configuration and download and update ./google-services.json:

```bash
keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Adding native code

Expo does support certain native code through its "plugin" list in "app.json". After having run "yarn add" on the package, run this to rebuild the app.

```bash
npx expo prebuild --clean
```

## Native code

Certain code like the Google Admob and firebase scripts can't be run on Expo Go.
For these you have to build a development build (A personalized expo go app) and install it to your device.
Then it works as expo go would.

Alternatively: Follow this guide to set up the emulator: <https://docs.expo.dev/workflow/android-studio-emulator/>

### Android debugging

Run this command in the terminal and try again.

```bash
adb kill-server
```

## Implementation Details

### z-Index

Always apply zIndex and elevation together. What follows are some default height values in the app

-   Outline - 0
-   Interactable - 1
-   While dragging - 2
-   Help-box - 3

## How to save user progress

### Initial thoughts

I need to be able to track user progress on 2000+ individual characters. Each one of these characters has different skills associated with them, and those skills can have different levels. I will need to quickly calculate what the user should study next, with some sort of prioritization function.

This data should be local first, no need for the app to be connected to the internet at all times, offline should work. Ideally, this data should be synced to a server so that we can do data processing on user data and provide data backup, migration, and device sync.

For now: Just save it to a file. /shrug/

### Local / Synced Storage Requirements

1. First-hand React Native / Expo Support
1. Maintained / Not deprecated
1. Automatic data syncing (Do not want to maintain syncing code)
1. Typed data (Typescript)
1. (Optional) Persistent data on Mobile
1. (Optional) Json like data
1. (Optional) Full-text search
1. (Optional) Authentication

Databases to consider:

-   CR-SQLite
    -   Proof of concept by the expo team
-   PouchDB (Offline first / sync)
    -   Not maintained
-   SurrealDB (Looks dope)
    -   No React / React Native support
-   RxDB
    -   RxStorage SQLite is a paid package.
-   Firebase (Made for app development / Google)
    -   React Native Firebase SDK
    -   Maintained
    -   Automatic syncing
    -   Typescript support
    -   Persistence, customizable cache limit
    -   (EXTRA) Gives access to Google Analytics and crashlytics
-   Watermelon DB
    -   Made for React Native SDK
    -   Local Only - Needs backend
    -   Offline first
    -   Lazy loading - Fast startup
    -   Need to implement a sync engine / Code. Keeps track of changes.
    -   Typescript
-   Realm
    -   Has React Native specific SDK
    -   Local and Backend
    -   Syncs automatically
    -   Lazy loaded kinda?

Database:
Character Table:
Character:
Skills:
Level:
Last seen:
History: [{}]

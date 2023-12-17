# Kanjiken

The kanji app to end all other kanji apps. Hopefully.

## Installation

```
yarn install
```

## Start Expo:

```
yarn start
```

## Add new secrets to EXPO

```
(eas secret:delete) if you are replacing it
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json
```

## Google sign-in on android
To get this to work i had to copy the SHA1 key into firebase configuration and download and update ./google-services.json:

```
keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Adding native code.
Expo does support certain native code through it's "plugin" list in "app.json". After having "yarn add"'ed the packacke, run this to rebuild the app.

```
expo prebuild --clean
```

## Android Emulator

Certain code like the google admob scripts can't be run on Expo Go. Follow this guide to set up the emulator: https://docs.expo.dev/workflow/android-studio-emulator/

### Error: No connection could be made

Run this command in the terminal and try again.

```
adb kill-server
```

## Implementation Details

### z-Index:

Always apply zIndex and elevation together. What follows are some default height values in the app

-   Outline - 0
-   Interactable - 1
-   While dragging - 2
-   Help-box - 3

## How to save user progress

### Initial thoughs

I need to be able to track user progress on 2000+ individual characters. Each one of these characters have different skills associated with them, and those skills can have different levels. I will need to quickly calculate what the user should study next, with some sort of prioritazation function.

This data should be local first, no need for the app to be connected to the internet at all times, offline should work. Ideally this data should be synced to a server, so that we can do data processing on user data and provide databackup / migration / device sync.

For now: Just save to file. /shrug/

### Local / Synced Storage Requirements:

1. First hand React Native / Expo Support
1. Maintained / Not depricated
1. Automatic data syncing (Do not want to maintain syncing code)
1. Typed data (Typescript)
1. (Optional) Persistent data on Mobile
1. (Optional) Json like data
1. (Optional) Full-text search
1. (Optional) Authentication

Databases to consider:

-   CR-SQLite
    -   Proof of concept / beta by the expo team
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
    -   Persistance, customizable cache limit
    -   (EXTRA) Gives access to google analytics / crashalytics
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

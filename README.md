# Kanjiken

## Start:

'yarn start'

## z-Index:

Always apply zIndex and elevation together.

Outline - 0
Interactable - 1
While dragging - 2
Help-box - 3

## How to save user progress

Here are my thoughts. I need to be able to track user progress on 2000+ individual characters. Each one of these characters have different skills associated with them, and those skills can have different levels. I will need to quickly calculate what the user should study next, with some sort of prioritazation function.

For now: Just save to file. /shrug

Backend requirements:

1. React Native Support
1. Package should be maintained
1. Automatic data syncing (Do not want to maintain syncing code)
1. Typed data (Typescript)
1. (Optional) Persistent data on Mobile
1. (Optional) Json like data
1. (Optional) Full-text search
1. (Optional) Authentication

Databases to consider:

- PouchDB (Offline first / sync)
  - Not maintained
- SurrealDB (Looks dope)
  - No React / React Native support
- RxDB
  - RxStorage SQLite is a paid package.
- Firebase (Made for app development / Google)
  - React Native Firebase SDK
  - Maintained
  - Automatic syncing
  - Typescript support
  - Persistance, customizable cache limit
  - (EXTRA) Gives access to google analytics / crashalytics
- Watermelon DB
  - Made for React Native SDK
  - Local Only - Needs backend
  - Offline first
  - Lazy loading - Fast startup
  - Need to implement a sync engine / Code. Keeps track of changes.
  - Typescript
- Realm
  - Has React Native specific SDK
  - Local and Backend
  - Syncs automatically
  - Lazy loaded kinda?

Database:
Character Table:
Character:
Skills:
Level:
Last seen:
History: [{}]

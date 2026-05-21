# TaskManager — Enterprise React Native Task App

Cross-platform task management application built with **React Native 0.82**, **TypeScript**, **Redux Toolkit**, **Realm** (offline-first), **Firebase Auth/Firestore**, **multi-environment flavors**, and **local/FCM notifications**.

## Features

- Email/password authentication (Firebase Auth) with persisted session
- Full task CRUD with completion toggle, search, and filters
- Offline-first storage (Realm) with Firestore sync queue
- Automatic background sync when connectivity returns (NetInfo)
- Local reminder notifications (Notifee) + FCM foreground handler
- Dev/Prod environments via `react-native-config`, Android flavors, iOS schemes
- Dark / light / system theme with persistence
- ESLint and Prettier

## Tech Stack

| Area | Library |
|------|---------|
| Framework | React Native 0.82, TypeScript |
| State | Redux Toolkit, React Redux |
| Navigation | React Navigation 7 (native stack) |
| Auth / Cloud | `@react-native-firebase/auth`, `firestore`, `messaging` |
| Local DB | Realm |
| Config | react-native-config |
| Network | @react-native-community/netinfo |
| Notifications | @notifee/react-native |
| Forms | react-hook-form, zod |
| UX | react-native-toast-message |

## Project Structure

```
src/
├── components/     # Reusable UI (common, task, navigation)
├── config/         # Environment helpers
├── constants/
├── database/       # Realm schemas + repository
├── hooks/
├── navigation/     # Auth, App, Root navigators
├── redux/          # Slices, store, sync middleware
├── screens/        # auth, home, task
├── services/       # firebase, sync, notifications
├── theme/
├── types/
└── utils/
development/        # Dev Firebase configs (source)
Production/         # Prod Firebase configs (source)
android/app/src/dev|prod/   # Flavor-specific google-services.json
ios/Firebase/Dev|Prod/      # iOS plist copies
```

## Architecture

### Offline-first sync

1. **Local DB is source of truth** — all reads/writes go to Realm first.
2. **Sync queue** — each create/update/delete enqueues a `SyncQueue` record.
3. **When online** — `syncService` pushes queue items to Firestore, then pulls remote changes.
4. **Conflict resolution** — compares `updatedAt`; remote wins if newer (unless local item is still `pending`).
5. **Sync status** on tasks: `pending` | `synced` | `failed` (after retry limit).

```
[UI] → Redux Thunk → Realm (+ Queue) → (online) → Firestore
                      ↑__________________________|
```

### State management

- **auth** — session, login/signup/logout thunks
- **tasks** — normalized entity adapter, filters, search
- **sync** — connectivity + queue metrics
- **theme** — persisted mode preference
- **syncMiddleware** — triggers sync after task mutations when online

## Firebase & Environment Setup

Firebase config files are provided in:

- `development/google-services.json` + `GoogleService-Info.plist` → **Dev**
- `Production/google-services.json` + `GoogleService-Info.plist` → **Prod**

Android copies are in `android/app/src/dev` and `android/app/src/prod`.  
iOS copies are in `ios/Firebase/Dev` and `ios/Firebase/Prod`.

**Add a Run Script build phase in Xcode** (before Compile Sources):

```bash
bash "${SRCROOT}/scripts/copy-firebase-config.sh"
```

### Environment files

Create these locally (they are gitignored):

| File | Purpose |
|------|---------|
| `.env.dev` | Development |
| `.env.prod` | Production |

```env
APP_ENV=development
API_URL=https://dev-api.example.com
FIREBASE_ENV=dev
```

### Android package IDs

| Flavor | Application ID |
|--------|----------------|
| dev | `com.taskManagementApp.dev` |
| prod | `com.taskManagement.prod` |

### iOS bundle IDs (xcconfig)

| Scheme | Bundle ID |
|--------|-----------|
| Dev | `com.taskManagement.dev` |
| Prod | `com.taskManagement.prod` |

## Installation

```bash
cd assigment
npm install

# iOS only (macOS)
cd ios && bundle install && bundle exec pod install && cd ..
```

## Running the App

### Start Metro

```bash
npm start
```

### Android

```bash
# Development debug
npm run android:dev

# Production release mode
npm run android:prod
```

### iOS

```bash
npm run ios:dev    # Scheme: Dev, ENVFILE=.env.dev
npm run ios:prod   # Scheme: Prod, ENVFILE=.env.prod
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run android:dev` | Dev flavor + `.env.dev` |
| `npm run android:prod` | Prod flavor + `.env.prod` |
| `npm run ios:dev` | Dev scheme |
| `npm run ios:prod` | Prod scheme |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm test` | Jest unit tests |

## Libraries Used

See `package.json` for pinned versions. Core: Realm, Redux Toolkit, React Navigation, React Native Firebase, Notifee, NetInfo, Async Storage, react-native-config, react-hook-form, zod.

## Troubleshooting (Windows)

### `Error: -classpath requires class path specification`

Fixed in this repo’s `android/gradlew.bat` (Gradle Windows bug with empty `CLASSPATH`). If you still see it:

```bash
cd android
gradlew.bat --stop
gradlew.bat clean
cd ..
npm run android:dev
```

### Build fails with “Unable to delete directory” (CMake / react-native-screens)

A previous Gradle process may be locking files. Stop daemons, clean, then rebuild:

```bash
cd android && gradlew.bat --stop && gradlew.bat clean && cd ..
npm run android:dev
```

For emulator-only dev builds (faster), use one ABI:

```bash
cd android
gradlew.bat app:installDevDebug -PreactNativeArchitectures=x86_64
```

## Known Limitations

1. **Date/time picker** for reminders is stubbed in the task form UI — extend with `@react-native-community/datetimepicker` for production date selection.
2. **iOS Firebase plist copy** requires the Xcode Run Script phase to be added manually after `pod install`.
3. **Staging environment** from the assignment PDF is not configured (only dev/prod); add `.env.staging` + a third flavor if needed.
4. **FCM background handlers** on iOS require additional APNs setup in Firebase Console.
5. **Windows** users can develop Android; iOS builds require macOS.
6. Sync conflict strategy is timestamp-based only (no field-level merge).

## Development Notes

- Enable **Email/Password** auth and **Firestore** in Firebase Console.
- Create Firestore rules restricting `users/{uid}/tasks` to the authenticated user.
- For FCM, upload APNs key (iOS) and test on a physical device.

## License

Private assignment project.

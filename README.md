# Trip Angkutan

Trip Angkutan is an Indonesian-language, local-first mobile application for recording transportation trips and vehicles. It is built with Ionic Angular and Capacitor and supports offline data capture, GPS coordinates, photos, local tariff calculation, trip history, and later synchronization with a REST API.

## Features

- Six-digit PIN authentication with device identification
- Home dashboard with user, region, connectivity, and trip summaries
- Loaded and empty-trip recording
- GPS capture for trip and vehicle records
- Vehicle data capture, including license plate, classification, type, photo, location, and tariff
- Local trip and vehicle persistence using Ionic Storage
- Trip history and trip detail views
- Automatic and manual synchronization when the device is online
- Pending-sync indicators for locally stored trips
- Camera, geolocation, network status, and persistent device preferences through Capacitor

## Technology Stack

- Angular 22
- Ionic Angular 9
- Capacitor 7
- TypeScript 6
- RxJS 7
- Ionic Storage with IndexedDB or SQLite backing
- Angular ESLint
- Vitest and jsdom for the configured test environment

## Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── constants/       Application constants and API configuration
│   │   ├── guards/          Route guards
│   │   ├── services/        Authentication, API, storage, sync, and native services
│   │   └── utils/           Shared utilities
│   ├── data/
│   │   └── models/          Trip, vehicle, user, tariff, and region models
│   └── features/
│       ├── auth/            Splash and login pages
│       ├── home/            Dashboard
│       ├── profile/         User profile and logout
│       └── trip/            Trip creation, vehicle input, history, and details
├── environments/            Development and production environment values
├── theme/                   Ionic theme variables
├── global.scss              Global styles
└── main.ts                  Angular application bootstrap
```

Native Android configuration is stored under `android/`. Capacitor web output is generated in `www/`.

## Requirements

- Node.js 22 or a Node.js version supported by Angular 22
- npm
- Android Studio, Android SDK, and a Java 21-compatible JDK for native Android development
- Android SDK 36 for the checked-in Android project
- Access to the configured Trip Angkutan API
- A device or emulator with camera and location support for native feature testing

The Android project uses Gradle 8.14.3 through the included Gradle wrapper.

## Installation

Install the locked npm dependencies:

```bash
npm ci
```

The API base URL is configured in `src/app/core/constants/app.constants.ts` and is currently:

```text
https://api.tripangkut.com/v1
```

The development and production environment files use the same API URL. Change the configuration before deploying to an environment that requires a different backend.

## Development

Start the Angular development server:

```bash
npm start
```

Create a development build and watch for changes:

```bash
npm run watch
```

## Build

Create a production build:

```bash
npm run build
```

The build output is written to `www/`, which is the Capacitor web directory configured in `capacitor.config.ts`.

## Android

Synchronize the current web build with the checked-in Android project:

```bash
npm run build
npx cap sync android
```

Open the project in Android Studio:

```bash
npx cap open android
```

Build and run it on a connected device or emulator from Android Studio, or use:

```bash
npx cap run android
```

The configured Android application ID is `com.plantation.tripangkut`, and the display name is `Trip Angkutan`.

Camera and location features require the relevant native permissions and device capabilities. Verify platform permissions before release builds.

## Validation

Run ESLint:

```bash
npm run lint
```

Run the configured unit-test command:

```bash
npm test
```

Run the Angular application build as an additional type and template check:

```bash
npm run build
```

## Application Flow

1. The app opens on the splash screen and restores a locally stored session when available.
2. Users without a valid local session enter a six-digit PIN.
3. Authenticated users can start a trip from the Home tab.
4. Trip and vehicle records are saved locally before synchronization.
5. Completed trips appear in History with their synchronization status.
6. The synchronization service attempts to upload pending trips automatically and can also be triggered manually.

## Local Data

The Ionic Storage database is named `tripangkut_db`. The application stores:

- The current user and session data
- Trips and their nested vehicle records
- A local tariff cache

Trips are retained locally so they remain available without a network connection. A pending trip is one that has not been marked synchronized or permanently failed.

## Configuration Files

- `angular.json`: Angular build, serve, test, and lint configuration
- `ionic.config.json`: Ionic project metadata
- `capacitor.config.ts`: Capacitor application identity and web directory
- `src/environments/environment.ts`: Development environment values
- `src/environments/environment.prod.ts`: Production environment values
- `tsconfig.json`: Shared strict TypeScript settings
- `eslint.config.js`: ESLint configuration

## License

No license file is included in this repository. Confirm the project license before distributing the application or its source code.

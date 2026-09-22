# Graph Report - Aplikasi-Trip-Ionic  (2026-09-21)

## Corpus Check
- 79 files · ~117,518 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 533 nodes · 793 edges · 47 communities (40 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa1f56f1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- input-vehicle.page.ts
- dependencies
- dependencies
- storage.service.ts
- StorageService
- devDependencies
- app
- options
- AuthService
- Trip Angkutan Android
- architect
- production
- org.junit.Test
- ci
- lint
- development
- gradlew
- MainActivity.java
- eslint.config.js
- capacitor.config.ts
- environment.ts
- environment.prod.ts
- Trip Angkutan
- index.js
- admin/package.json
- middleware/auth.js
- LoginPage
- db.js
- trips.js
- routes/auth.js
- officers.js
- regions.js
- reports.js
- vehicles.js
- ProfilePage
- tabs.routes.ts
- enums.ts
- AboutPage
- api.constants.ts

## God Nodes (most connected - your core abstractions)
1. `StorageService` - 37 edges
2. `TripModel` - 24 edges
3. `AuthService` - 21 edges
4. `InputVehiclePage` - 14 edges
5. `Trip Angkutan` - 14 edges
6. `ApiService` - 13 edges
7. `SyncService` - 13 edges
8. `NetworkService` - 12 edges
9. `TripService` - 11 edges
10. `Trip Angkutan Android` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AuthService` --references--> `UserModel`  [EXTRACTED]
  src/app/core/services/auth.service.ts → src/app/data/models/user.model.ts
- `TripModel` --references--> `VehicleModel`  [EXTRACTED]
  src/app/data/models/trip.model.ts → src/app/data/models/vehicle.model.ts
- `HomePage` --references--> `TripModel`  [EXTRACTED]
  src/app/features/home/home.page.ts → src/app/data/models/trip.model.ts
- `TripService` --references--> `TripModel`  [EXTRACTED]
  src/app/core/services/trip.service.ts → src/app/data/models/trip.model.ts
- `VehicleModel` --references--> `Golongan`  [EXTRACTED]
  src/app/data/models/vehicle.model.ts → src/app/data/models/tariff.model.ts

## Import Cycles
- None detected.

## Communities (47 total, 7 thin omitted)

### Community 0 - "input-vehicle.page.ts"
Cohesion: 0.08
Nodes (20): CameraService, Injectable, GpsResult, LocationService, Injectable, TariffService, Injectable, generateId() (+12 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (47): @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router, @capacitor/android (+39 more)

### Community 2 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, better-sqlite3, cors, express, jsonwebtoken, uuid, description (+12 more)

### Community 3 - "storage.service.ts"
Cohesion: 0.08
Nodes (18): AppComponent, Component, routes, API_BASE_URL, APP_CONSTANTS, ApiResponse, ApiService, Injectable (+10 more)

### Community 4 - "StorageService"
Cohesion: 0.07
Nodes (14): StorageService, Injectable, TripService, Injectable, TariffModel, TripModel, HistoryPage, Component (+6 more)

### Community 5 - "devDependencies"
Cohesion: 0.05
Nodes (37): @angular/build, @angular/compiler-cli, angular-eslint, @angular/language-service, @capacitor/cli, eslint, @ionic/angular-toolkit, jsdom (+29 more)

### Community 6 - "app"
Cohesion: 0.09
Nodes (21): prefix, projectType, root, schematics, sourceRoot, analytics, schematicCollections, standalone (+13 more)

### Community 7 - "options"
Cohesion: 0.15
Nodes (13): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+5 more)

### Community 8 - "AuthService"
Cohesion: 0.07
Nodes (12): AuthGuard, Injectable, AuthService, Injectable, LoginPage, Component, SplashPage, Component (+4 more)

### Community 9 - "Trip Angkutan Android"
Cohesion: 0.17
Nodes (11): Backend integration, Configuration, Development workflow, Features, Prerequisites, Project structure, Release builds, Running and debugging (+3 more)

### Community 10 - "architect"
Cohesion: 0.18
Nodes (12): architect, extract-i18n, test, builder, options, buildTarget, setupFiles, tsConfig (+4 more)

### Community 11 - "production"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, fileReplacements (+1 more)

### Community 12 - "org.junit.Test"
Cohesion: 0.36
Nodes (4): ExampleInstrumentedTest, ExampleUnitTest, org.junit.runner.RunWith, org.junit.Test

### Community 13 - "ci"
Cohesion: 0.29
Nodes (7): serve, progress, watch, ci, builder, configurations, defaultConfiguration

### Community 14 - "lint"
Cohesion: 0.33
Nodes (6): lint, builder, options, lintFilePatterns, src/**/*.html, src/**/*.ts

### Community 15 - "development"
Cohesion: 0.33
Nodes (6): development, buildTarget, extractLicenses, namedChunks, optimization, sourceMap

### Community 16 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 29 - "Trip Angkutan"
Cohesion: 0.13
Nodes (14): Android, Application Flow, Build, Configuration Files, Development, Features, Installation, License (+6 more)

### Community 30 - "index.js"
Cohesion: 0.14
Nodes (11): app, authRoutes, cors, db, express, officerRoutes, regionRoutes, reportRoutes (+3 more)

### Community 31 - "admin/package.json"
Cohesion: 0.22
Nodes (8): dependencies, serve, name, scripts, dev, start, version, serve

### Community 32 - "middleware/auth.js"
Cohesion: 0.29
Nodes (6): authenticate(), jwt, { authenticate }, db, express, router

### Community 33 - "LoginPage"
Cohesion: 0.25
Nodes (3): LoginPage, TODO: call api.login(pinHash, deviceId) when backend ready, Component

### Community 34 - "db.js"
Cohesion: 0.33
Nodes (6): bcrypt, Database, db, initialize(), seedData(), { v4: uuidv4 }

### Community 35 - "trips.js"
Cohesion: 0.29
Nodes (5): { authenticate }, db, express, router, { v4: uuidv4 }

### Community 36 - "routes/auth.js"
Cohesion: 0.33
Nodes (5): bcrypt, db, express, jwt, router

### Community 37 - "officers.js"
Cohesion: 0.33
Nodes (5): { authenticate }, bcrypt, db, express, router

### Community 38 - "regions.js"
Cohesion: 0.40
Nodes (4): { authenticate }, db, express, router

### Community 39 - "reports.js"
Cohesion: 0.40
Nodes (4): { authenticate }, db, express, router

### Community 40 - "vehicles.js"
Cohesion: 0.40
Nodes (4): { authenticate }, db, express, router

### Community 41 - "ProfilePage"
Cohesion: 0.40
Nodes (3): ProfilePage, TODO: implement logout, Component

### Community 42 - "tabs.routes.ts"
Cohesion: 0.40
Nodes (4): ./history.page, ./home.page, ./profile.page, routes

### Community 43 - "enums.ts"
Cohesion: 0.50
Nodes (3): Golongan, JenisKendaraan, StatusMuatan

## Knowledge Gaps
- **195 isolated node(s):** `name`, `version`, `dev`, `start`, `serve` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StorageService` connect `StorageService` to `AuthService`, `input-vehicle.page.ts`, `storage.service.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `TripModel` connect `StorageService` to `input-vehicle.page.ts`, `storage.service.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `version`, `dev` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `input-vehicle.page.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08470588235294117 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
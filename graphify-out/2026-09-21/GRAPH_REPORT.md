# Graph Report - Aplikasi-Trip-Ionic  (2026-09-21)

## Corpus Check
- 57 files · ~16,399 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 381 nodes · 621 edges · 29 communities (24 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `78a25203`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- input-vehicle.page.ts
- dependencies
- sync.service.ts
- AuthService
- StorageService
- devDependencies
- app
- options
- package.json
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

## God Nodes (most connected - your core abstractions)
1. `StorageService` - 35 edges
2. `TripModel` - 22 edges
3. `AuthService` - 21 edges
4. `InputVehiclePage` - 14 edges
5. `ApiService` - 13 edges
6. `SyncService` - 13 edges
7. `TripService` - 11 edges
8. `Trip Angkutan Android` - 11 edges
9. `options` - 10 edges
10. `VehicleModel` - 10 edges

## Surprising Connections (you probably didn't know these)
- `TripService` --references--> `TripModel`  [EXTRACTED]
  src/app/core/services/trip.service.ts → src/app/data/models/trip.model.ts
- `TripModel` --references--> `VehicleModel`  [EXTRACTED]
  src/app/data/models/trip.model.ts → src/app/data/models/vehicle.model.ts
- `AuthService` --references--> `UserModel`  [EXTRACTED]
  src/app/core/services/auth.service.ts → src/app/data/models/user.model.ts
- `VehicleModel` --references--> `Golongan`  [EXTRACTED]
  src/app/data/models/vehicle.model.ts → src/app/data/models/tariff.model.ts
- `InputVehiclePage` --references--> `Golongan`  [EXTRACTED]
  src/app/features/trip/input-vehicle/input-vehicle.page.ts → src/app/data/models/tariff.model.ts

## Import Cycles
- None detected.

## Communities (29 total, 5 thin omitted)

### Community 0 - "input-vehicle.page.ts"
Cohesion: 0.09
Nodes (21): CameraService, Injectable, LocationService, Injectable, TariffService, Injectable, TripService, Injectable (+13 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (47): @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router, @capacitor/android (+39 more)

### Community 2 - "sync.service.ts"
Cohesion: 0.07
Nodes (17): AppComponent, Component, routes, API_BASE_URL, APP_CONSTANTS, ApiResponse, ApiService, Injectable (+9 more)

### Community 3 - "AuthService"
Cohesion: 0.08
Nodes (14): AuthGuard, Injectable, AuthService, Injectable, hashPin(), UserModel, LoginPage, Component (+6 more)

### Community 4 - "StorageService"
Cohesion: 0.10
Nodes (9): StorageService, Injectable, TripModel, HistoryPage, Component, SuccessDialogPage, Component, TripDetailPage (+1 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): @angular/build, @angular/compiler-cli, angular-eslint, @angular/language-service, @capacitor/cli, eslint, @ionic/angular-toolkit, jsdom (+17 more)

### Community 6 - "app"
Cohesion: 0.09
Nodes (21): prefix, projectType, root, schematics, sourceRoot, analytics, schematicCollections, standalone (+13 more)

### Community 7 - "options"
Cohesion: 0.15
Nodes (13): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+5 more)

### Community 8 - "package.json"
Cohesion: 0.15
Nodes (12): author, homepage, name, private, scripts, build, lint, ng (+4 more)

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

## Knowledge Gaps
- **109 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `schematics` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StorageService` connect `StorageService` to `input-vehicle.page.ts`, `sync.service.ts`, `AuthService`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `TripModel` connect `StorageService` to `input-vehicle.page.ts`, `sync.service.ts`, `AuthService`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `input-vehicle.page.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09049773755656108 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `sync.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07149758454106281 - nodes in this community are weakly interconnected._
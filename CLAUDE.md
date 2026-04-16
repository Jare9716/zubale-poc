# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm web            # Run in browser
```

No lint or test scripts are currently configured.

## Architecture

This is an Expo (SDK 54) React Native app with New Architecture enabled, built around camera scanning. The entry point is `index.ts` → `App.tsx` → `src/navigation/`.

**Navigation structure:**

```
RootStack (native-stack)
  └─ BottomTab
      └─ Camera (CameraScreen)
          ├─ QrScanner    (modal)
          └─ BarCodeScanner (modal)
```

Navigation uses `@react-navigation/native` v7's `createStaticNavigation` API (not the older JSX-based approach).

**Source layout under `src/`:**
- `navigation/` — root stack + bottom tab definitions
- `screens/cameraScreen/` — main screen + `components/` (QrScanner, BarCodeScanner)

State is managed with plain React hooks (`useState`). No global state library is in use.

**Camera:** `expo-camera` handles both QR and barcode scanning. Camera permissions are requested at runtime inside `CameraScreen`. Both scanner components follow the same pattern: full-screen camera view with a flip button.

**Path alias:** `@/*` maps to `./src/*` (configured in `tsconfig.json` and supported by Expo's Metro config).

**Package manager:** pnpm with `nodeLinker=hoisted` (see `.npmrc`/`pnpm-workspace.yaml`).

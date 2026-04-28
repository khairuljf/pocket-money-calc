# Pocket Money

A simple monthly pocket-money tracker for Android and iOS. Add money to your wallet, log what you spend, and review transactions grouped by month.

## Stack

- Expo (React Native) + TypeScript
- NativeWind (Tailwind CSS)
- AsyncStorage for local persistence
- lucide-react-native icons
- dayjs for date formatting

## Develop

```bash
bun install
bun run start          # opens Expo dev tools (scan QR with Expo Go)
bun run ios            # iOS simulator
bun run android        # Android emulator
```

The app stores all data on-device via AsyncStorage. There is no backend.

## Build for Play Store / App Store

Install the EAS CLI and log in once:

```bash
bun add -g eas-cli
eas login
eas build:configure
```

Then build:

```bash
eas build --platform android --profile production   # AAB for Play Store
eas build --platform ios --profile production       # IPA for App Store
```

Update `android.versionCode` (and `version`) in `app.json` for every Play Store submission.

## Project layout

```
App.tsx                       Entry point
components/                   UI building blocks (BalanceCard, forms, list)
hooks/useWallet.ts            Balance + transactions state, persisted to AsyncStorage
lib/storage.ts                AsyncStorage helpers
lib/groupByMonth.ts           Pure helper that groups transactions by month
types.ts                      Shared types
legacy/                       Original web (HTML/JS) version, kept for reference
```

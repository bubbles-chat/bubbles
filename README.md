# Bubbles
A chat application built with Expo React Native.
## Introduction
This is a restructured project based on the original [Bubbles project](https://github.com/Youssef-S-Negm/Bubbles).

1. **Reasons for Restructuring:** The original project structure presented limitations. The previous version relied exclusively on Firebase for message and attachment storage, which imposed constraints during development—such as Firebase’s daily download limits—and limited application features, like sending notifications through FCM.
2. **Key differencies:** This new version includes a custom [backend](https://github.com/bubbles-chat/bubblesbackend) to support additional features, such as real-time notifications for connection requests and new messages, providing more control and scalability than Firebase alone.
---
## Getting started
### Required files
- `google-services.json` Place this file in the root directory for Firebase configuration.
### Required enviroment variables (`.env`):
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` The Web Client ID found in the `google-services.json` file for Google authentication.
- `EXPO_PUBLIC_API_URL` The base URL of the backend server.
### Commands
1. Install dependencies
   ```bash
   npm install
   ```
2. Create a development build
   ```bash
   npm run android
   ```
   or
   ```bash
   npx expo run:android
   ```
3. Start the development client
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start --dev-client
   ```
   ---
## Notes
Some components, such as `CustomModal`, screen headers, and tab bars, use the `BlurView` component from the `expo-blur` module as a background effect. Currently, the blur effect is disabled for headers and tab bars due to graphical issues on Android when used with `react-native-screens`, as outlined in the [expo-blur documentation](https://docs.expo.dev/versions/latest/sdk/blur-view/#:~:text=This%20method%20may%20lead%20to%20decreased%20performance%20and%20rendering%20issues%20during%20transitions%20made%20by%20react%2Dnative%2Dscreens).

If you enable the blur effect on Android and encounter graphical issues (e.g., a blank white screen during screen transitions), you can temporarily resolve this by putting the app in the background and then reopening it. This workaround helps to refresh the screen, mitigating the graphical issue.
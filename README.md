This project implements a React Native authentication flow with Login, Signup, and Home screens using React Context API, AsyncStorage persistence, and React Navigation.

## Features
- Auth state managed via Context API with AsyncStorage persistence
- Login, Signup, and Home screens with validation and error handling
- Password visibility toggle
- Micro-interactions: input focus styling, button press feedback, disabled states, and loading indicators

## Setup
> **Note**: Make sure you have completed the React Native environment setup guide: https://reactnative.dev/docs/set-up-your-environment

### Install dependencies
```sh
npm install
```

### Icon assets (required for vector icons)
```sh
npx react-native-asset
```

### iOS (CocoaPods)
```sh
bundle install
bundle exec pod install
```

## Run the app
```sh
# Start Metro
npm start

# Android
npm run android

# iOS
npm run ios
```

## Project Structure
- `src/context/AuthContext.tsx`: Auth state, login/signup/logout, AsyncStorage persistence
- `src/screens/`: Login, Signup, Home screens
- `src/navigation/RootNavigator.tsx`: Navigation flow
- `src/components/AuthTextInput.tsx`: Shared input component
- `src/theme/colors.ts`: Shared UI palette

## Screenshots / Demo
Home screen:
![Home screen](https://raw.githubusercontent.com/mashad6/KloudiusAuthTest/main/src/screenshot/home.png)

Login screen:
![Login screen](https://raw.githubusercontent.com/mashad6/KloudiusAuthTest/main/src/screenshot/login.png)

Signup screen:
![Signup screen](https://raw.githubusercontent.com/mashad6/KloudiusAuthTest/main/src/screenshot/signup.png)

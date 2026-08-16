import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="location-permission" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report-details" />
        <Stack.Screen name="report-submitted" />
        <Stack.Screen name="report-tracking/[id]" />
        <Stack.Screen name="feedback/[id]" />
        <Stack.Screen name="map-view" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help" />
        <Stack.Screen name="report-litterer/select-type" />
        <Stack.Screen name="report-litterer/capture" />
        <Stack.Screen name="report-litterer/details" />
        <Stack.Screen name="report-litterer/review" />
        <Stack.Screen name="report-litterer/submitted" />
      </Stack>
    </SafeAreaProvider>
  );
}


import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'CourierPrime-Regular': require('../assets/fonts/CourierPrime-Regular.ttf'),
    'CourierPrime-Bold': require('../assets/fonts/CourierPrime-Bold.ttf'),
});

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

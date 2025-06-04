import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <Stack
            screenOptions={{
              headerTitleAlign: "center",
              headerShown: false,
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default RootLayout;

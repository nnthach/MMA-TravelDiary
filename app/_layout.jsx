import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { SavedPostProvider } from "../context/SavedPostContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <SavedPostProvider>
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
      </SavedPostProvider>
    </AuthProvider>
  );
};

export default RootLayout;

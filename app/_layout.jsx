import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { SavedPostProvider } from "../context/SavedPostContext";
import { PostProvider } from "../context/PostContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <SavedPostProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerTitleAlign: "center",
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </SafeAreaProvider>
        </SavedPostProvider>
      </PostProvider>
    </AuthProvider>
  );
};

export default RootLayout;

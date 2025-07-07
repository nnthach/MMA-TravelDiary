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
      </PostProvider>
    </AuthProvider>
  );
};

export default RootLayout;

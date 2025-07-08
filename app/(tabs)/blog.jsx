import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BlogScreen() {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View>
        <Text>Blog screen</Text>
      </View>
    </SafeAreaView>
  );
}

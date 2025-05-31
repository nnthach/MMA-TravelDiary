import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const route = useRouter();
  return (
    <>
      {/*Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => route.back()}
          style={{
            position: "absolute",
            left: 10,
            zIndex: 1,
          }}
        />

        <Text
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          Post detail
        </Text>
      </View>

      <View>
        <Text>PostDetail {id}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
});

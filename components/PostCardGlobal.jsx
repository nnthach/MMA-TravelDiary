import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PostCardGlobal({ item }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => {
        router.push(`/post/${item.id}`);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.user}</Text>

        {/*Action icon in post */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Ionicons name="bookmark-outline" size={20} color="black" />
          <Ionicons name="alert-circle-outline" size={22} color="black" />
        </View>
      </View>
      <Text style={{ color: "grey", fontSize: 12 }}>{item.date}</Text>
      <View
        style={{
          marginVertical: 5,
          maxHeight: 54,
          overflow: "hidden",
        }}
      >
        <Text>{item.content}</Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Image
          source={{
            uri: item.img,
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    width: "100%",
    height: 300,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
};

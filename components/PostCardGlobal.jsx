import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import storageAPIs from "../services/storageAPIs";

export default function PostCardGlobal({ item }) {
  const { userId } = useContext(AuthContext);
  const router = useRouter();

  const handleAddPostToStorage = async (postId) => {
    try {
      const data = {
        userId,
        posts: [{ postId }],
      };
      const result = await storageAPIs.create(data);
      console.log("result", result);
      alert(result.message);
    } catch (error) {
      console.log("add post to storage err", error);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => {
        router.push(`/post/${item._id}`);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {item.username}
        </Text>

        {/*Action icon in post */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="bookmark-outline"
            size={20}
            color="black"
            onPress={() => handleAddPostToStorage(item._id)}
          />
          <Ionicons name="alert-circle-outline" size={22} color="black" />
        </View>
      </View>
      <Text style={{ color: "grey", fontSize: 12 }}>{item.createdAt}</Text>
      <View
        style={{
          marginVertical: 5,
          maxHeight: 54,
          overflow: "hidden",
        }}
      >
        <Text style={{ fontWeight: 600 }}>{item.title}</Text>
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
            uri: item?.images[0],
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
    height: 400,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
};

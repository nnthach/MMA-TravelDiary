import { View, Image, Dimensions, TouchableOpacity } from "react-native";

export default function PostCardProfile({ post }) {
  const screenWidth = Dimensions.get("window").width;
  const itemSize = screenWidth / 3;

  console.log("post", post);

  return (
    <View
      style={{
        width: itemSize,
        height: itemSize,
        backgroundColor: "lightgrey",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "white",
      }}
    >
      <TouchableOpacity>
        <Image
          source={{ uri: post.images[0] }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
}

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function PostCardProfile({ post }) {
  const screenWidth = Dimensions.get("window").width;
  const itemSize = screenWidth / 3;
  const router = useRouter();

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
      <TouchableOpacity
        onPress={() => router.push(`/(stack)/post/${post._id}`)}
      >
        <Image
          source={{
            uri: post.images[0],
          }}
          style={{
            width: itemSize,
            height: itemSize,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
}

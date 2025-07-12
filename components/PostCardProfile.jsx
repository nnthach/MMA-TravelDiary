import { Video } from "expo-av";
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
        {post.images?.[0]?.type === "video" ? (
          <Video
            source={{ uri: post.images[0].uri }}
            style={{
              width: itemSize,
              height: itemSize,
            }}
            resizeMode="cover"
            isLooping
            useNativeControls={false}
            shouldPlay={false}
          />
        ) : (
          <Image
            source={{ uri: post.images?.[0]?.uri }}
            style={{
              width: itemSize,
              height: itemSize,
            }}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

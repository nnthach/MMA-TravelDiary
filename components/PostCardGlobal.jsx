import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function PostCardGlobal({ item }) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.user}</Text>
        <Text>{item.date}</Text>
      </View>

      <View
        style={{
          marginVertical: 5,
          maxHeight: 54,
          overflow: "hidden",
        }}
      >
        <Text>
          {item.content}
        </Text>
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
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
};

import { Image, Text, TouchableOpacity, View } from "react-native";

function BookCard({ item, height, width, ...props }) {
  return (
    <TouchableOpacity
      style={{
        width,
        height: height + 45,
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width,
          height,
          flexDirection: "column",
        }}
      >
        {/*Image */}
        <View style={{ width, height }}>
          <Image
            source={{
              uri: item.image,
            }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 10,
            }}
          />
        </View>

        {/*Info */}
        <View style={{ marginTop: "auto", paddingVertical: 3 }}>
          <Text style={{ fontWeight: 600 }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: "#4B4B4B" }}>{item.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default BookCard;

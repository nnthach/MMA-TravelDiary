import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function LocationHomeCard({ item }) {
  const route = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() =>
        route.push({
          pathname: "/(stack)/location",
          params: { city: item.city, country: item.country },
        })
      }
    >
      <View style={styles.imgWrap}>
        <Image
          source={{
            uri: item.img,
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View style={{ position: "absolute", bottom: 5, left: 5 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          {item.country}
        </Text>
        <Text style={{ color: "white", fontSize: 18 }}>{item.city}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imgWrap: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
});

export default LocationHomeCard;

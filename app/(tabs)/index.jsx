import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BookCard from "../../components/BookCard";

export default function HomeScreen() {
  return (
    <View>
      {/*Header */}
      <View style={styles.header}>
        <Text>TravelDiary</Text>
      </View>
      <Text>view</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#fff",
  },
});

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BookCard from "../../components/BookCard";
import LocationHomeCard from "../../components/LocationHomeCard";

export default function HomeScreen() {
  const fakeDataLocationHomeCard = [
    {
      img: "https://cdn.xanhsm.com/2025/02/c0c9124a-vinh-ha-long-1.jpg",
      country: "Viet Nam",
      city: "Vinh Ha Long",
    },
    {
      img: "https://suckhoedoisong.qltns.mediacdn.vn/Images/thanhloan/2020/11/28/Nam-2030-du-lich-ha-noi-phan-dau-tro-thanh-nganh-kinh-te-mui-nhon-cua-thu-do-19.jpg",
      country: "Viet Nam",
      city: "Ha Noi",
    },
    {
      img: "https://d3pa5s1toq8zys.cloudfront.net/explore/wp-content/uploads/2023/10/Ho-Chi-Minh-city-Places-to-Visit.jpg",
      country: "Viet Nam",
      city: "Ho Chi Minh",
    },
    {
      img: "https://dulichvietnam.com.vn/kinh-nghiem/wp-content/uploads/2018/07/khi-ban-hoi-brazil-co-gi-noi-tieng-chung-toi-se-tra-loi-ngay-lap-tuc-hinh-anh-1.jpg",
      country: "Brazil",
      city: "Ho Chi Minh",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Moonrise_over_kuala_lumpur.jpg/960px-Moonrise_over_kuala_lumpur.jpg",
      country: "Malaysia",
      city: "Kuala Lumpur",
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      {/*Header */}
      <View style={styles.header}>
        <Text>TravelDiary</Text>
      </View>

      <FlatList
        data={fakeDataLocationHomeCard}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item }) => <LocationHomeCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 10 }}
      />
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

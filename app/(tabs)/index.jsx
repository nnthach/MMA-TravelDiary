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
  const screenWidth = Dimensions.get("window").width;

  const bannerImages = [
    "https://img.freepik.com/free-vector/flat-world-book-day-horizontal-banner_23-2149327026.jpg?t=st=1747192387~exp=1747195987~hmac=6fddc9af9fe80ed60741ce19f979a39e3b4adb1de7c7bb40ee34dffedf1256a2",
    "https://i.pinimg.com/736x/d6/fb/ac/d6fbac84ee1f3f6176c3e146fb2399cc.jpg",
    "https://i.etsystatic.com/7849180/r/il/baa2b5/1888816369/il_fullxfull.1888816369_t0aw.jpg",
  ];

  const popularBooks = [
    {
      image:
        "https://nhasachphuongnam.com/images/detailed/217/dac-nhan-tam-bc.jpg",
      title: "Dac Nhan Tam",
      author: "Johnny",
    },
    {
      image:
        "https://nhasachphuongnam.com/images/detailed/217/dac-nhan-tam-bc.jpg",
      title: "Dac Nhan Tam",
      author: "Johnny",
    },
    {
      image:
        "https://nhasachphuongnam.com/images/detailed/217/dac-nhan-tam-bc.jpg",
      title: "Dac Nhan Tam",
      author: "Johnny",
    },
    {
      image:
        "https://nhasachphuongnam.com/images/detailed/217/dac-nhan-tam-bc.jpg",
      title: "Dac Nhan Tam",
      author: "Johnny",
    },
    {
      image:
        "https://nhasachphuongnam.com/images/detailed/217/dac-nhan-tam-bc.jpg",
      title: "Dac Nhan Tam",
      author: "Johnny",
    },
  ];

  const widthBook = 120;
  const heightBook = widthBook * 1.6;

  return (
    <>
      {/*Header */}
      <View style={styles.header}>
        {/*Logo */}
        <View>
          <Text>Logo</Text>
        </View>

        {/*Header icon */}
        <View>
          <Ionicons name="cart-outline" size={24} color="black" />
        </View>
      </View>

      {/*Main content */}
      <ScrollView style={{ backgroundColor: "red" }}>
        {/*Banner */}
        <View>
          <ScrollView
            horizontal={true}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {bannerImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  width: screenWidth,
                  height: 200,
                  resizeMode: "cover",
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/*Popular */}
        <View style={{ backgroundColor: "white", padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Popular</Text>

          <ScrollView
            style={{ marginTop: 10 }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              {popularBooks.map((book, index) => (
                <BookCard
                  key={index}
                  item={book}
                  width={widthBook}
                  height={heightBook}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});

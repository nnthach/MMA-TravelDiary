import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostCardGlobal from "../../../components/PostCardGlobal";

export default function LocationScreen() {
  const { city, country } = useLocalSearchParams();

  const route = useRouter();

  const postFakeData = [
    {
      id: 1,
      user: "Minh",
      date: "Mar 25, 2025",
      content:
        "Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.",
      img: "https://twistedsifter.com/wp-content/uploads/2014/06/selfie-from-the-top-of-christ-the-redeemer-rio-de-janeiro-brazil.jpg",
    },
    {
      id: 2,
      user: "Minh",
      date: "Mar 25, 2025",
      content:
        "Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.",
      img: "https://twistedsifter.com/wp-content/uploads/2014/06/selfie-from-the-top-of-christ-the-redeemer-rio-de-janeiro-brazil.jpg",
    },
    {
      id: 3,
      user: "Minh",
      date: "Mar 25, 2025",
      content:
        "Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.",
      img: "https://twistedsifter.com/wp-content/uploads/2014/06/selfie-from-the-top-of-christ-the-redeemer-rio-de-janeiro-brazil.jpg",
    },
    {
      id: 4,
      user: "Minh",
      date: "Mar 25, 2025",
      content:
        "Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.Private pools & sea views stretch out amid the coastal enclave of Amanoi – an away-from-it-all escape on Vietnam's Vinh Hy Bay.",
      img: "https://twistedsifter.com/wp-content/uploads/2014/06/selfie-from-the-top-of-christ-the-redeemer-rio-de-janeiro-brazil.jpg",
    },
  ];
  return (
    <>
      {/*Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => route.back()}
          style={{
            position: "absolute",
            left: 10,
            zIndex: 1,
          }}
        />

        <Text
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          Welcome to {city}, {country}
        </Text>
      </View>

      {/*Content */}
      {/* <View style={{ flex: 1, padding: 10 }}>
        <PostCardGlobal />
      </View> */}
      <FlatList
        data={postFakeData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCardGlobal item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 10 }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
});

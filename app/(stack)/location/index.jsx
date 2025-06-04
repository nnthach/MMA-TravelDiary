import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostCardGlobal from "../../../components/PostCardGlobal";
import { useCallback, useState } from "react";
import postAPIs from "../../../services/postAPIs";

export default function LocationScreen() {
  const { city, country } = useLocalSearchParams();
  const [postListData, setPostListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRouter();

  useFocusEffect(
    useCallback(() => {
      const getAllPost = async () => {
        setIsLoading(true);
        try {
          const res = await postAPIs.getAllPost();
          setPostListData(res);
          setIsLoading(false);
        } catch (error) {
          console.log("error", error);
          setIsLoading(false);
        }
      };
      getAllPost();
    }, [])
  );
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

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="black" />
          <Text>Loading</Text>
        </View>
      ) : (
        <FlatList
          data={postListData}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <PostCardGlobal item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
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

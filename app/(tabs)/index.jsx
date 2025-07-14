import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PostContext } from "../../context/PostContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { SavedPostContext } from "../../context/SavedPostContext";
import { AuthContext } from "../../context/AuthContext";
import CommentModal from "../../components/CommentModal";
import PostCardGlobal from "../../components/PostCardGlobal";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { postListData, isLoading, getAllPost } = useContext(PostContext);
  const { savedPostData } = useContext(SavedPostContext);
  const { userId, userInfo } = useContext(AuthContext);
  const [openComment, setOpenComment] = useState(false);

  // useEffect(() => {
  //   getAllPost();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getAllPost();
    }, [])
  );

  if (isLoading) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>...Loading</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {/*Header */}
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
          renderItem={({ item }) => (
            <PostCardGlobal
              item={item}
              // b1: convert mảng object của savedPostData => mảng string chứa các id
              // b2: so sánh các id đó với id của fetchAllPost xem có trùng thì trả về true
              isSaved={
                userInfo && savedPostData.map((p) => p._id).includes(item._id)
              }
              isOwner={userInfo && userId == item.userId}
              setOpenComment={setOpenComment}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

      {openComment && (
        <CommentModal
          setOpenComment={setOpenComment}
          openComment={openComment}
        />
      )}
    </SafeAreaView>
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

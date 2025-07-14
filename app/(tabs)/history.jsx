import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import PostCardGlobal from "../../components/PostCardGlobal";
import { SavedPostContext } from "../../context/SavedPostContext";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentModal from "../../components/CommentModal";

export default function HistoryScreen() {
  const { userId } = useContext(AuthContext);
  const { savedPostData, isLoading, fetchStorageOfUser } =
    useContext(SavedPostContext);
  const [openComment, setOpenComment] = useState(false);
  console.log("saved pos data", savedPostData);

  useFocusEffect(
    useCallback(() => {
      fetchStorageOfUser();
    }, [])
  );

  useEffect(() => {
    fetchStorageOfUser();
  }, [openComment]);

  if (isLoading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
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
      {/* Header */}
      <View
        style={{
          backgroundColor: "white",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Saved Posts</Text>
      </View>

      {!savedPostData?.length || !userId ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Not found saved posts</Text>
        </View>
      ) : (
        <FlatList
          data={savedPostData}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <PostCardGlobal
              item={item}
              isSaved={true}
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

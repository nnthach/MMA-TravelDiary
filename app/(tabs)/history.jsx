import { useCallback, useContext } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import PostCardGlobal from "../../components/PostCardGlobal";
import { SavedPostContext } from "../../context/SavedPostContext";
import { useFocusEffect } from "expo-router";

export default function HistoryScreen() {
  const { userId } = useContext(AuthContext);
  const { savedPostData, isLoading, fetchStorageOfUser } =
    useContext(SavedPostContext);

  useFocusEffect(
    useCallback(() => {
      fetchStorageOfUser();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <>
      {/* Header */}
      <View
        style={{
          backgroundColor: "white",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{}}>Saved Posts</Text>
      </View>

      {!savedPostData.length || !userId ? (
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
            <PostCardGlobal item={item} isSaved={true} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </>
  );
}

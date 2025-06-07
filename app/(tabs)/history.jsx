import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import storageAPIs from "../../services/storageAPIs";
import { AuthContext } from "../../context/AuthContext";
import PostCardGlobal from "../../components/PostCardGlobal";

export default function HistoryScreen() {
  const { userId } = useContext(AuthContext);
  const [postListData, setPostListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getStorageOfUser = async () => {
        setIsLoading(true);
        try {
          const res = await storageAPIs.getStorageOfUser(userId);
          setPostListData(res);
          setIsLoading(false);
        } catch (error) {
          console.log("error", error);
          setIsLoading(false);
        }
      };
      getStorageOfUser();
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

      {!postListData.length || !userId ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Not found saved posts</Text>
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

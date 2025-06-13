import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import storageAPIs from "../services/storageAPIs";
import { SavedPostContext } from "../context/SavedPostContext";
import { handleAddPostToStorage, handleRemovePostOutOfStorage } from "../utils/updateStorage";

export default function PostCardGlobal({
  item,
  isSaved = false,
  isOwner = false,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const router = useRouter();
  const { fetchStorageOfUser } = useContext(SavedPostContext);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => {
        router.push(`/post/${item._id}`);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {item.username}
        </Text>

        {/*Action icon in post */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          {isOwner ? (
            <Ionicons
              name="build-outline"
              size={22}
              color="black"
              onPress={(e) => {
                e.stopPropagation();
                console.log("edit icon");
                router.push(`/post/edit/${item._id}`);
              }}
            />
          ) : (
            <>
              {isSaved ? (
                <Ionicons
                  name="bookmark"
                  size={20}
                  color="black"
                  onPress={() =>
                    handleRemovePostOutOfStorage(
                      userId,
                      item._id,
                      fetchStorageOfUser
                    )
                  }
                />
              ) : (
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color="black"
                  onPress={() => handleAddPostToStorage(
                                          userInfo,
                                          userId,
                                          item._id,
                                          fetchStorageOfUser
                                        )}
                />
              )}
              <Ionicons name="alert-circle-outline" size={22} color="black" />
            </>
          )}
        </View>
      </View>
      <Text style={{ color: "grey", fontSize: 12 }}>{item.createdAt}</Text>
      <View
        style={{
          marginVertical: 5,
          maxHeight: 54,
          overflow: "hidden",
        }}
      >
        <Text style={{ fontWeight: 600 }}>{item.title}</Text>
        <Text>{item.content}</Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Image
          source={{
            uri: item?.images[0],
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    width: "100%",
    height: 400,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
};

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import postAPIs from "../../../services/postAPIs";
import { SavedPostContext } from "../../../context/SavedPostContext";
import { AuthContext } from "../../../context/AuthContext";
import storageAPIs from "../../../services/storageAPIs";
import {
  handleAddPostToStorage,
  handleRemovePostOutOfStorage,
} from "../../../utils/updateStorage";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const { savedPostData, fetchStorageOfUser } = useContext(SavedPostContext);
  const { userInfo, userId } = useContext(AuthContext);
  const [openDropMenu, setOpenDropMenu] = useState(false);

  const route = useRouter();

  const getPostById = async () => {
    setIsLoading(true);
    try {
      const res = await postAPIs.getById(id);
      setPostDetail(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setPostDetail(null);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPostById();
    }, [])
  );

  const handleChangePublic = async (id) => {
    const updatedPost = {
      userId: postDetail.userId,
      public: postDetail.public == false ? true : false,
    };

    try {
      await postAPIs.update(id, updatedPost);

      getPostById();

      setOpenDropMenu(false);
      alert("Update success");
    } catch (error) {
      console.log("error update public", error);
    }
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <>
      {/*Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => route.back()}
          style={styles.iconHeader}
        />

        <Text style={styles.textTitleHeader}>{postDetail?.title}</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: "white" }}>
        {/*Post header */}
        <View style={styles.postHeader}>
          <Text style={{ fontWeight: 500, fontSize: 18 }}>
            {postDetail?.username}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                backgroundColor: postDetail?.public ? "green" : "#f1df00",
                color: "white",
                fontWeight: "bold",
                padding: 5,
                borderRadius: 5,
              }}
            >
              {postDetail?.public ? "Public" : "Private"}
            </Text>

            {userInfo && userId == postDetail?.userId ? (
              <View style={{ position: "relative" }}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={26}
                  color="black"
                  onPress={() => setOpenDropMenu((prev) => !prev)}
                />

                {openDropMenu && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        paddingHorizontal: 10,
                        width: "100%",
                      }}
                      onPress={() => {
                        console.log("change public");
                        handleChangePublic(postDetail?._id);
                      }}
                    >
                      <Text style={{ textAlign: "right" }}>
                        Change to{" "}
                        {postDetail?.public == false ? "Public" : "Private"}
                      </Text>
                    </TouchableOpacity>
                    {/*Edit menu */}
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        paddingHorizontal: 10,
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                      onPress={(e) => {
                        e.stopPropagation();
                        route.push(`/post/edit/${postDetail._id}`);
                      }}
                    >
                      <Ionicons name="build-outline" size={20} color="black" />
                      <Text style={{ textAlign: "right", marginLeft: 5 }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <>
                {userInfo &&
                savedPostData.map((p) => p._id).includes(postDetail?._id) ? (
                  <Ionicons
                    name="bookmark"
                    size={20}
                    color="black"
                    onPress={() =>
                      handleRemovePostOutOfStorage(
                        userId,
                        postDetail._id,
                        fetchStorageOfUser
                      )
                    }
                  />
                ) : (
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    color="black"
                    onPress={() =>
                      handleAddPostToStorage(
                        userInfo,
                        userId,
                        postDetail._id,
                        fetchStorageOfUser
                      )
                    }
                  />
                )}
                <Ionicons name="alert-circle-outline" size={22} color="black" />
              </>
            )}
          </View>
        </View>

        {/*Post Image */}
        <View>
          <FlatList
            data={postDetail?.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").width,
                }}
                resizeMode="cover"
              />
            )}
          />
        </View>
        {/*Post content */}
        <View style={styles.postContent}>
          <Text>{postDetail?.content}</Text>
        </View>
      </View>
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
  iconHeader: { position: "absolute", left: 10, zIndex: 1 },
  textTitleHeader: {
    width: "100%",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  postContent: { paddingHorizontal: 10, paddingVertical: 10 },

  dropdownMenu: {
    position: "absolute",
    backgroundColor: "white",
    width: 132,
    height: 70,
    top: 30,
    right: 0,
    zIndex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
});

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import postAPIs from "../../../services/postAPIs";
import { SavedPostContext } from "../../../context/SavedPostContext";
import { AuthContext } from "../../../context/AuthContext";
import FooterPost from "../../../components/FooterPost";
import ReportModal from "../../../components/ReportModal";
import CommentModal from "../../../components/CommentModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import { PostContext } from "../../../context/PostContext";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const { savedPostData, fetchStorageOfUser } = useContext(SavedPostContext);
  const { postId, setPostId, getAllPost } = useContext(PostContext);
  const { userInfo, userId } = useContext(AuthContext);
  const [openDropMenu, setOpenDropMenu] = useState(false);
  const [openComment, setOpenComment] = useState(false);

  console.log("savedPost data in detail", savedPostData);
  console.log("post detail", postDetail);

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

  useEffect(() => {
    getPostById();
  }, [openComment]);

  const isSaved =
    userInfo &&
    postDetail &&
    savedPostData?.some((p) => p._id === postDetail._id);

  const isOwner = userInfo && postDetail && userId === postDetail.userId;

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
      await getAllPost();
    } catch (error) {
      console.log("error update public", error.response.data);
      Alert.alert(error?.response?.data?.message || "Change error");
    }
  };

  const [openReport, setOpenReport] = useState(false);
  const [reportDataForm, setReportDataForm] = useState({
    postId: "",
    reporterId: userId,
    reason: "",
    description: "",
  });

  const handleDeletePost = async (id) => {
    try {
      const res = await postAPIs.delete(id);
      console.log("delete post res", res);
      route.back();
    } catch (error) {
      console.log("delete post err", error);
    }
  };

  if (isLoading && !postDetail) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 100,
                overflow: "hidden",
                backgroundColor: "lightgrey",
              }}
            >
              <Image
                source={{ uri: postDetail?.avatar }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />
            </View>
            <Text style={{ fontWeight: 500, fontSize: 18 }}>
              {postDetail?.username}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {postDetail?.isBanned ? (
              <Text
                style={{
                  backgroundColor: "red",
                  color: "white",
                  fontWeight: "bold",
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                Banned
              </Text>
            ) : (
              userId == postDetail?.userId && (
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
              )
            )}

            {userInfo && userId == postDetail?.userId && (
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
                    {/*Delete menu */}
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
                        handleDeletePost(postDetail._id);
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color="black" />
                      <Text style={{ textAlign: "right", marginLeft: 5 }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
              <View>
                {item.type === "image" ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").width,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Video
                    source={{ uri: item.uri }}
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").width,
                    }}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                  />
                )}
              </View>
            )}
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <FooterPost
            item={postDetail}
            setOpenComment={setOpenComment}
            setPostId={setPostId}
            isSaved={isSaved}
            isOwner={isOwner}
            setOpenReport={setOpenReport}
            setReportDataForm={setReportDataForm}
          />
        </View>

        {/*Post content */}
        <View style={styles.postContent}>
          <Text>{postDetail?.content}</Text>
        </View>
      </View>

      {/*Modal report */}
      {openReport && (
        <ReportModal
          openReport={openReport}
          setOpenReport={setOpenReport}
          reportDataForm={reportDataForm}
          setReportDataForm={setReportDataForm}
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
  postContent: { paddingHorizontal: 20, paddingVertical: 10 },

  dropdownMenu: {
    position: "absolute",
    backgroundColor: "white",
    width: 135,
    height: 100,
    top: 30,
    right: 0,
    zIndex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    textAlignVertical: "top", // multiline đẹp hơn
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  reportButton: {
    flex: 1,
    backgroundColor: "#ff4d4f", // đỏ
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#d9d9d9", // xám sáng
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

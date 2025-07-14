import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ReportModal from "./ReportModal";
import { PostContext } from "../context/PostContext";
import FooterPost from "./FooterPost";
import { Video } from "expo-av";
import { SavedPostContext } from "../context/SavedPostContext";

export default function PostCardGlobal({
  item,
  isSaved = false,
  isOwner = false,
  setOpenComment,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [openReport, setOpenReport] = useState(false);
  const { setPostId } = useContext(PostContext);
  const { fetchStorageOfUser } = useContext(SavedPostContext);

  // ✅ Like state riêng để cập nhật UI ngay
  const [likes, setLikes] = useState(() =>
    Array.isArray(item?.likes) ? item.likes : []
  );

  const isLiked = likes.includes(userId);

  const { setPostListData } = useContext(PostContext);

  const handleOpenComment = (id) => {
    if (!id) return;
    setPostId(id);
    setOpenComment(true);
  };

  const handleToggleLike = async () => {
    const updatedLikes = isLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes); // ✅ cập nhật UI ngay

    setPostListData((prev) =>
      prev.map((post) =>
        post._id === item._id ? { ...post, likes: updatedLikes } : post
      )
    );

    try {
      await postAPIs.toggleLike(item._id, userId); // gửi lên server
    } catch (error) {
      console.error("Lỗi khi like/unlike bài viết:", error);
    }
  };

  const [reportDataForm, setReportDataForm] = useState({
    postId: "",
    reporterId: userId,
    reason: "",
    description: "",
  });

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.touchAbleWrap}
          onPress={() => router.push(`/post/${item._id}`)}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
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
                  source={{ uri: item.avatar }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.username}>{item.username}</Text>
            </View>
            {isOwner && (
              <Ionicons
                name="build-outline"
                size={22}
                color="black"
                onPress={(e) => {
                  e.stopPropagation();
                  router.push(`/post/edit/${item._id}`);
                }}
              />
            )}
          </View>

          {/* Created At */}
          <Text style={styles.createdAt}>
            {new Date(item.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
          {/* Location */}
          <Text style={styles.createdAt}>
            {item.ward}, {item.district}, {item.province}
          </Text>

          {/* Content */}
          <View style={styles.content}>
            <Text style={{ fontWeight: "600" }}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>

          {/* Image */}
          {item?.images?.length > 0 && (
            <View style={styles.imageWrap}>
              {item.images[0].type === "image" ? (
                <Image
                  source={{ uri: item.images[0].uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Video
                  source={{ uri: item.images[0].uri }}
                  style={styles.image}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <FooterPost
          item={item}
          setOpenComment={setOpenComment}
          setPostId={setPostId}
          isSaved={isSaved}
          isOwner={isOwner}
          setOpenReport={setOpenReport}
          setReportDataForm={setReportDataForm}
        />
      </View>

      {/* Report Modal */}
      {openReport && (
        <ReportModal
          openReport={openReport}
          setOpenReport={setOpenReport}
          reportDataForm={reportDataForm}
          setReportDataForm={setReportDataForm}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 450,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  touchAbleWrap: {
    width: "100%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
  },
  createdAt: {
    color: "grey",
    fontSize: 12,
  },
  content: {
    marginVertical: 5,
    maxHeight: 54,
    overflow: "hidden",
  },
  imageWrap: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  footerWrap: {
    marginTop: 10,
    width: "100%",
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

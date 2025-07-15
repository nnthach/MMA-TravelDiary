import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { SavedPostContext } from "../context/SavedPostContext";
import { PostContext } from "../context/PostContext";
import {
  handleAddPostToStorage,
  handleRemovePostOutOfStorage,
} from "../utils/updateStorage";
import postAPIs from "../services/postAPIs";

export default function FooterPost({
  item,
  isOwner,
  isSaved,
  setOpenComment,
  setOpenReport,
  setReportDataForm,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const { fetchStorageOfUser } = useContext(SavedPostContext);
  const { setPostId,getPostDetail } = useContext(PostContext);

  // ✅ Like state riêng để cập nhật UI ngay
  const [likes, setLikes] = useState(() =>
    Array.isArray(item?.likes) ? item.likes : []
  );

  const isLiked = likes.includes(userId);

  const { setPostListData } = useContext(PostContext);

  const handleOpenComment = async (id) => {
    if (!id) return;

    setPostId(id);
    console.log("get post detail in footer",id);
    await getPostDetail(id);
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

  return (
   <View style={styles.footerWrap}>
  {/* Left */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity
      onPress={handleToggleLike}
      style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}
    >
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "red" : "black"}
      />
      <Text>{likes?.length}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => handleOpenComment(item._id)}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Ionicons name="chatbubbles-outline" size={24} color="black" />
      {item?.comments?.length >= 1 && (
        <Text style={{ marginLeft: 5 }}>{item?.comments?.length}</Text>
      )}
    </TouchableOpacity>
  </View>

  {/* Right */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    {!isOwner && (
      <>
        {isSaved ? (
          <TouchableOpacity
            onPress={() =>
              handleRemovePostOutOfStorage(userId, item._id, fetchStorageOfUser)
            }
            style={{ marginRight: 10 }}
          >
            <Ionicons name="bookmark" size={20} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              handleAddPostToStorage(
                userInfo,
                userId,
                item._id,
                fetchStorageOfUser
              )
            }
            style={{ marginRight: 10 }}
          >
            <Ionicons name="bookmark-outline" size={20} color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setReportDataForm((prev) => ({
              ...prev,
              postId: item._id,
            }));
            setOpenReport(true);
          }}
        >
          <Ionicons name="alert-circle-outline" size={22} color="black" />
        </TouchableOpacity>
      </>
    )}
  </View>
</View>

  );
}

const styles = StyleSheet.create({
  footerWrap: {
    marginTop: 10,
    width: "100%",
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

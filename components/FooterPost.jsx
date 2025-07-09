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
  setActionPostID,
  setOpenReport,
  setReportDataForm,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const { fetchStorageOfUser } = useContext(SavedPostContext);

  // ✅ Like state riêng để cập nhật UI ngay
  const [likes, setLikes] = useState(() =>
    Array.isArray(item?.likes) ? item.likes : []
  );

  const isLiked = likes.includes(userId);

  const { setPostListData } = useContext(PostContext);

  const handleOpenComment = (id) => {
    if (!id) return;
    setActionPostID(id);
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
      <View style={{ flexDirection: "row", gap: 15 }}>
        <TouchableOpacity
          onPress={handleToggleLike}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "red" : "black"}
          />
          <Text>{likes?.length}</Text> {/* ✅ dùng state */}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          onPress={() => handleOpenComment(item._id)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="black" />
          {item?.comments?.length >= 1 && <Text>{item?.comments?.length}</Text>}
        </TouchableOpacity>
      </View>

      {/* Right */}
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        {!isOwner && (
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
                onPress={() =>
                  handleAddPostToStorage(
                    userInfo,
                    userId,
                    item._id,
                    fetchStorageOfUser
                  )
                }
              />
            )}
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="black"
              onPress={() => {
                setReportDataForm((prev) => ({
                  ...prev,
                  postId: item._id,
                }));
                setOpenReport(true);
              }}
            />
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

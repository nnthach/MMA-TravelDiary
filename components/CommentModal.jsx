import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import commentAPIs from "../services/commentAPIs";
import { useFocusEffect } from "expo-router";
import { PostContext } from "../context/PostContext";

export default function CommentModal({ setOpenComment, openComment }) {
  const { isLoading, postDetail, getAllPost, getPostDetail } =
    useContext(PostContext);
  const { userId, userInfo } = useContext(AuthContext);
  const { postId, setPostId } = useContext(PostContext);
  const [commentDataForm, setCommentDataForm] = useState({
    userId: userId,
    content: "",
    postId: postId,
  });
  const [openDropMenuCommentId, setOpenDropMenuCommentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleGetCommentDetail = async (id) => {
    try {
      const res = await commentAPIs.getById(id);
      console.log("get comment detail res", res);
      setCommentDataForm((prev) => ({
        ...prev,
        content: res.data.content,
      }));
      setIsEditing(true);
      setEditingCommentId(id);
      setOpenDropMenuCommentId(null);
    } catch (error) {
      console.log("get comment detail error", error);
    }
  };

  const handleUpdateComment = async () => {
    try {
      const res = await commentAPIs.update(editingCommentId, {
        content: commentDataForm?.content,
        postId: postDetail._id,
      });
      console.log("update comment res", res.data);

      setIsEditing(false);
      setEditingCommentId(null);
      setCommentDataForm((prev) => ({
        ...prev,
        content: "",
      }));

      setOpenComment(false);
      Alert.alert("Update successfully");

      await getPostDetail(postId);
    } catch (error) {
      console.log("update comment error", error);
      Alert.alert("Error", "Update failed");
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      const res = await commentAPIs.delete(id);
      console.log("delete comment res", res.data);
      setOpenComment(false);

      Alert.alert("Delete successfully");
      await getPostDetail(postId);
      await getAllPost();
    } catch (error) {
      console.log("delete comment errro", error);
    }
  };

  const handleCreateComment = async () => {
    try {
      const res = await commentAPIs.create(commentDataForm);

      setCommentDataForm((prev) => ({
        ...prev,
        content: "",
      }));

      setIsEditing(false);
      setOpenComment(false);
      Alert.alert("Create successfully");
      await getPostDetail(postId);
      await getAllPost();
    } catch (error) {
      if (error.response && error.response.data?.message) {
        Alert.alert(error.response.data.message);
      } else {
        Alert.alert("Something wrong");
      }
      console.log("create comment err", error);
      setCommentDataForm((prev) => ({
        ...prev,
        content: "",
      }));
      setIsEditing(false);
    }
  };

  return (
    <Modal
      visible={openComment}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setPostId(null);
        setOpenComment(false);
      }}
    >
      <View style={styles.overlay}>
        {isLoading ? (
          <View>
            <Text>Loading</Text>
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Comments</Text>
              <TouchableOpacity onPress={() => setOpenComment(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {postDetail?.comments?.length < 1 ? (
              <View style={{ flex: 1 }}>
                <Text>No comments</Text>
              </View>
            ) : (
              <FlatList
                data={postDetail?.comments}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item: comment }) => (
                  <View
                    key={comment._id}
                    style={{
                      marginBottom: 15,
                      position: "relative",
                      zIndex: openDropMenuCommentId === comment._id ? 9999 : 0,
                    }}
                  >
                    {/*Comment-item-heading */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/*Left */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                          {comment?.authorName || "user"}
                        </Text>
                        <Text style={{ color: "grey" }}>
                          {comment?.createdAt &&
                            new Date(comment.createdAt).toLocaleString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                        </Text>
                      </View>
                      {/*Right */}
                      <View style={{ position: "relative" }}>
                        {comment?.author.toString() === userId && (
                          <Ionicons
                            name="ellipsis-vertical"
                            size={18}
                            color="black"
                            onPress={() =>
                              setOpenDropMenuCommentId((prev) =>
                                prev === comment._id ? null : comment._id
                              )
                            }
                          />
                        )}

                        {openDropMenuCommentId === comment._id && (
                          <View style={styles.dropdownMenu}>
                            {/*Edit menu */}
                            <TouchableOpacity
                              style={styles.dropdownMenuItem}
                              onPress={() => {
                                handleGetCommentDetail(comment._id);
                              }}
                            >
                              <Ionicons
                                name="build-outline"
                                size={20}
                                color="black"
                              />
                              <Text
                                style={{ textAlign: "right", marginLeft: 5 }}
                              >
                                Edit
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.dropdownMenuItem}
                              onPress={() => {
                                console.log("delete");
                                handleDeleteComment(comment._id);
                              }}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={20}
                                color="black"
                              />
                              <Text
                                style={{ textAlign: "right", marginLeft: 5 }}
                              >
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      {/*End right header of comment */}
                    </View>
                    {/*Comment-item-content */}
                    <Text>{comment?.content || "content"}</Text>
                  </View>
                )}
              />
            )}

            {/*Input comment */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingTop: 10,
                  paddingBottom: Platform.OS === "ios" ? 20 : 10,
                }}
              >
                {/* <View style={{ maxWidth: 45, overflow: "hidden" }}>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 16 }}
                    numberOfLines={1}
                  >
                    {userInfo?.username || "guest"}
                  </Text>
                </View> */}
                <TextInput
                  style={styles.input}
                  placeholder="Type here"
                  value={commentDataForm.content}
                  onChangeText={(text) =>
                    setCommentDataForm((prev) => ({ ...prev, content: text }))
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    if (isEditing) {
                      console.log("run update");
                      handleUpdateComment();
                    } else {
                      console.log("run create");
                      handleCreateComment();
                    }
                  }}
                >
                  <Ionicons name="send" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
    flex: 1,
    textAlignVertical: "top",
    fontSize: 14,
  },
  dropdownMenu: {
    position: "absolute",
    backgroundColor: "white",
    width: 90,
    height: 70,
    top: 20,
    right: 5,
    zIndex: 10000,
    elevation: 10,
    alignItems: "flex-end",
    justifyContent: "center",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },

  dropdownMenuItem: {
    padding: 5,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

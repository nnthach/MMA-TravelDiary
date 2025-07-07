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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import commentAPIs from "../services/commentAPIs";
import postAPIs from "../services/postAPIs";
import { useFocusEffect } from "expo-router";

export default function CommentModal({
  actionPostID,
  setActionPostID,
  setOpenComment,
  openComment,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const [commentDataForm, setCommentDataForm] = useState({
    userId: userId,
    content: "",
    postId: actionPostID,
  });
  const [postDetail, setPostDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("post detail", postDetail);

  const getPostById = async () => {
    setIsLoading(true);
    try {
      const res = await postAPIs.getById(actionPostID);
      console.log("get pos dtetail res", res);
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

  const handleCreateComment = async () => {
    try {
      const res = await commentAPIs.create(commentDataForm);
      console.log("create comment res data", res.data);

      setCommentDataForm((prev) => ({
        ...prev,
        content: "",
      }));

      await getPostById();
    } catch (error) {
      if (error.response && error.response.data?.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Something wrong");
      }
      console.log("create comment err", error);
    }
  };

  return (
    <Modal
      visible={openComment}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setActionPostID("");
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

            {postDetail?.comments.length < 1 ? (
              <View style={{ flex: 1 }}>
                <Text>No comments</Text>
              </View>
            ) : (
              <ScrollView style={{ flex: 1 }}>
                {postDetail?.comments.map((comment) => (
                  <View key={comment._id} style={{ marginBottom: 15 }}>
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
                          {comment?.createdAt || "24/4/2025"}
                        </Text>
                      </View>
                      {/*Right */}
                    </View>
                    {/*Comment-item-content */}
                    <Text>{comment?.content || "content"}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/*Input comment */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingTop: 10,
                paddingBottom: Platform.OS === "ios" ? 20 : 10,
              }}
            >
              <View style={{ maxWidth: 45, overflow: "hidden" }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {userInfo?.username || "guest"}
                </Text>
              </View>
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
                  console.log("comment send", commentDataForm);
                  // reset nếu muốn
                  handleCreateComment();
                }}
              >
                <Ionicons name="send" size={22} color="black" />
              </TouchableOpacity>
            </View>
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
});

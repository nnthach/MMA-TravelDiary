import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { AuthContext } from "../../../context/AuthContext";
import postAPIs from "../../../services/postAPIs";

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    images: [],
  });

  const { userId, username } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPIs.getAllPost();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error.response || error.message);
      Alert.alert("Error", "Unable to load posts");
    } finally {
      setLoading(false);
    }
  };

  const showPostDetails = (post) => {
    setPostDetails(post);
    setShowDetailsModal(true);
  };

  const showPostEdit = (post) => {
    setPostDetails(post);
    setNewPost({
      title: post.title,
      content: post.content,
      images: post.images,
    });
    setShowEditModal(true);
  };

  const handleChange = (name, value) => {
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = async () => {
    const postToCreate = {
      userId,
      username,
      title: newPost.title,
      content: newPost.content,
      images: newPost.images,
    };

    try {
      const { data } = await postAPIs.create(postToCreate);
      setPosts((prevPosts) => [data, ...prevPosts]);
      Alert.alert("Success", "Post has been added");
      setShowAddModal(false);
      setNewPost({ title: "", content: "", images: [] });
    } catch (error) {
      Alert.alert("Error", "Unable to add post");
      console.error("Error creating post:", error.response || error.message);
    }
  };

  const handleEditPost = async (id) => {
    const updatedPost = {
      userId: postDetails.userId,
      username: postDetails.username,
      title: newPost.title,
      content: newPost.content,
      images: newPost.images,
    };

    try {
      const { data } = await postAPIs.update(id, updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? { ...post, ...updatedPost } : post))
      );
      Alert.alert("Success", "Post updated");
      setShowEditModal(false);
    } catch (error) {
      Alert.alert("Error", "Unable to update post");
      console.error("Error updating post:", error.response || error.message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await postAPIs.delete(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      Alert.alert("Success", "Post has been deleted");
    } catch (error) {
      Alert.alert("Error", "Unable to delete post");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post List</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Username</Text>
          <Text style={styles.tableHeaderText}>Title</Text>
          <Text style={styles.tableHeaderText}>Actions</Text>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.username}</Text>
              <Text style={styles.tableCell}>{item.title}</Text>
              <View style={styles.tableActions}>
                <TouchableOpacity onPress={() => showPostDetails(item)}>
                  <Text style={styles.detailBtn}>Details</Text>
                </TouchableOpacity>
           
              </View>
            </View>
          )}
        />
      </View>

      {/* Post Details Modal */}
      <Modal visible={showDetailsModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post Details</Text>
            <Text style={styles.detailsText}>Username: {postDetails?.username}</Text>
            <Text style={styles.detailsText}>Title: {postDetails?.title}</Text>
            <Text style={styles.detailsText}>Content: {postDetails?.content}</Text>

            <View style={styles.imageContainer}>
        {Array.isArray(postDetails?.images) && postDetails.images.length > 0 ? (
  postDetails.images.map((media, index) => {
    if (!media || typeof media !== "object" || !media.uri) return null;

    const isVideo = media.type === "video";

    return (
      <View key={index} style={{ margin: 5 }}>
        {isVideo ? (
          <Video
            source={{ uri: media.uri }}
            style={{ width: 150, height: 150 }}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        ) : (
          <Image
            source={{ uri: media.uri }}
            style={{ width: 150, height: 150 }}
            resizeMode="cover"
          />
        )}
      </View>
    );
  })
) : (
  <Text>No media</Text>
)}

            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf3",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0d18e",
    backgroundColor: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f6c169",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff9ec",
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  detailBtn: {
    color: "#1d4ed8",
    fontWeight: "bold",
  },
  deleteBtn: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#f9f0e1",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  video: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
});

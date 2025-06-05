import React, { useState, useEffect } from "react";
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
import axiosClient from "../../config/axiosClient"; // Ensure correct path

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postDetails, setPostDetails] = useState(null); // To store the details of the clicked post

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get("/post");
      setPosts(data);
    } catch (error) {
      Alert.alert("Error", "Unable to load posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Open the details modal
  const showPostDetails = (post) => {
    setPostDetails(post);
    setShowModal(true);
  };

  // Add post
  const handleAddPost = () => {
    const newPost = {
      userId: postDetails.userId,
      username: postDetails.username,
      title: postDetails.title,
      content: postDetails.content,
      images: postDetails.images,
    };

    axiosClient
      .post("/post", newPost)
      .then((response) => {
        setPosts((prevPosts) => [response.data, ...prevPosts]);
        Alert.alert("Success", "Post has been added");
        setPostDetails({
          userId: "",
          username: "",
          title: "",
          content: "",
          images: [],
        });
        setShowModal(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to add post");
        console.error(error);
      });
  };

  // Edit post
  const handleEditPost = (id) => {
    const updatedPost = {
      userId: postDetails.userId,
      username: postDetails.username,
      title: postDetails.title,
      content: postDetails.content,
      images: postDetails.images,
    };

    axiosClient
      .put(`/post/${id}`, updatedPost)
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === id ? { ...post, ...updatedPost } : post
          )
        );
        Alert.alert("Success", "Post updated");
        setShowModal(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to update post");
        console.error(error);
      });
  };

  // Delete post
  const handleDeletePost = (id) => {
    axiosClient
      .delete(`/post/${id}`)
      .then(() => {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== id)
        );
        Alert.alert("Success", "Post has been deleted");
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to delete post");
        console.error(error);
      });
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
      <Text style={styles.title}>📑 Post List</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.addButtonText}>➕ Add Post</Text>
      </TouchableOpacity>

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

              {/* Actions */}
              <View style={styles.tableActions}>
                <TouchableOpacity
                  onPress={() => showPostDetails(item)} // Show details when clicked
                >
                  <Text style={styles.detailBtn}>🔍 Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEditPost(item._id)}
                >
                  <Text style={styles.editBtn}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePost(item._id)}
                >
                  <Text style={styles.deleteBtn}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal for viewing post details */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post Details</Text>

            {postDetails && (
              <>
                <Text style={styles.detailsText}>User ID: {postDetails.userId}</Text>
                <Text style={styles.detailsText}>Username: {postDetails.username}</Text>
                <Text style={styles.detailsText}>Title: {postDetails.title}</Text>
                <Text style={styles.detailsText}>Content: {postDetails.content}</Text>
                <View style={styles.imageContainer}>
                  {postDetails.images && postDetails.images.length > 0 ? (
                    postDetails.images.map((img, index) => (
                      <Image key={index} source={{ uri: img }} style={styles.image} />
                    ))
                  ) : (
                    <Text>No images</Text>
                  )}
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    paddingRight: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexWrap: "wrap",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    paddingRight: 10,
    paddingLeft: 10,
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  detailBtn: {
    color: "#007bff",
    fontWeight: "bold",
  },
  editBtn: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  deleteBtn: {
    color: "#F44336",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

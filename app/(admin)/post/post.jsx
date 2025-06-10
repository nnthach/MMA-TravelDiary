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
import { AuthContext } from "../../../context/AuthContext"; // Assuming you have AuthContext
import postAPIs from "../../../services/postAPIs"; // Import the postAPIs

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [postDetails, setPostDetails] = useState(null); // To store the details of the clicked post
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    images: [],
  });

  // Access the logged-in user's data from AuthContext
  const { userId, username } = useContext(AuthContext);

  // Fetch posts from API
const fetchPosts = async () => {
  try {
    setLoading(true);
    const response = await postAPIs.getAllPost(); // Using postAPIs here
    setPosts(response.data);
  } catch (error) {
    // Log error details to the console for debugging
    console.error('Error fetching posts:', error.response || error.message);
    Alert.alert('Error', 'Unable to load posts');
  } finally {
    setLoading(false);
  }
};


  // Open the details modal
  const showPostDetails = (post) => {
    setPostDetails(post);
    setShowDetailsModal(true);
  };

  // Open the edit modal
  const showPostEdit = (post) => {
    setPostDetails(post);
    setNewPost({
      title: post.title,
      content: post.content,
      images: post.images,
    });
    setShowEditModal(true);
  };

  // Handle Change in Form Inputs
  const handleChange = (name, value) => {
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create Post
  const handleCreatePost = async () => {
    const postToCreate = {
      userId: userId,
      username: username,
      title: newPost.title,
      content: newPost.content,
      images: newPost.images,
    };

    try {
      const { data } = await postAPIs.create(postToCreate); // Using postAPIs here
      setPosts((prevPosts) => [data, ...prevPosts]);
      Alert.alert("Success", "Post has been added");
      setShowAddModal(false);
      setNewPost({ title: "", content: "", images: [] });
    } catch (error) {
      Alert.alert("Error", "Unable to add post");
      console.error("Error creating post:", error.response || error.message || error);
    }
  };

  // Edit Post
  const handleEditPost = async (id) => {
    const updatedPost = {
      userId: postDetails.userId,
      username: postDetails.username,
      title: newPost.title,
      content: newPost.content,
      images: newPost.images,
    };

    try {
      const { data } = await postAPIs.update(id, updatedPost); // Using postAPIs here
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id ? { ...post, ...updatedPost } : post
        )
      );
      Alert.alert("Success", "Post updated");
      setShowEditModal(false);
    } catch (error) {
      Alert.alert("Error", "Unable to update post");
      console.error("Error updating post:", error.response || error.message || error);
    }
  };

  // Delete Post
  const handleDeletePost = async (id) => {
    try {
      await postAPIs.delete(id); // Using postAPIs here
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
      <Text style={styles.title}> Post List</Text>

      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>➕ Add Post</Text>
      </TouchableOpacity> */}

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
                <TouchableOpacity onPress={() => showPostDetails(item)}>
                  <Text style={styles.detailBtn}>Details</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => showPostEdit(item)}>
                  <Text style={styles.editBtn}> Edit</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => handleDeletePost(item._id)}>
                  <Text style={styles.deleteBtn}> Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Add Post Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>

            {/* Input Fields for Creating a Post */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => handleChange("title", text)}
            />

            <TextInput
              style={[styles.input, { height: 150 }]} // Make it multiline
              placeholder="Content"
              value={newPost.content}
              onChangeText={(text) => handleChange("content", text)}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Images (comma separated)"
              value={newPost.images.join(", ")}
              onChangeText={(text) => handleChange("images", text.split(", "))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.submitButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Post Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Post</Text>

            {/* Input Fields for Editing a Post */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => handleChange("title", text)}
            />

            <TextInput
              style={[styles.input, { height: 150 }]} // Make it multiline
              placeholder="Content"
              value={newPost.content}
              onChangeText={(text) => handleChange("content", text)}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Images (comma separated)"
              value={newPost.images.join(", ")}
              onChangeText={(text) => handleChange("images", text.split(", "))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleEditPost(postDetails._id)}
              >
                <Text style={styles.submitButtonText}>Update Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Details Post Modal */}
      <Modal visible={showDetailsModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post Details</Text>
            <Text style={styles.detailsText}>Username: {postDetails?.username}</Text>
            <Text style={styles.detailsText}>Title: {postDetails?.title}</Text>
            <Text style={styles.detailsText}>Content: {postDetails?.content}</Text>

            {/* Displaying images if they exist */}
            <View style={styles.imageContainer}>
              {postDetails?.images && postDetails.images.length > 0 ? (
                postDetails.images.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={styles.image}
                  />
                ))
              ) : (
                <Text>No images uploaded</Text>
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

// Styles go here...
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
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
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
    justifyContent: "space-between",
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
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

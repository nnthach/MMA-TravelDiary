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
} from "react-native";
import userApi from "../../../services/userApi"; // Ensure the correct path

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ username: "", email: "" });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      Alert.alert("Error", "Unable to load user list");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add user
  const handleAddUser = () => {
    const newUser = {
      username: userData.username,
      email: userData.email,
      password: "password123", // Example password
    };

    userApi
      .create(newUser)
      .then((response) => {
        setUsers((prevUsers) => [response, ...prevUsers]);
        Alert.alert("Success", "User has been added");
        setUserData({ username: "", email: "" });
        setShowModal(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to add user");
        console.error(error);
      });
  };

  // Edit user
  const handleEditUser = () => {
    const updatedUser = {
      username: userData.username,
      email: userData.email,
    };

    userApi
      .update(currentUser._id, updatedUser)
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === currentUser._id ? { ...user, ...updatedUser } : user
          )
        );
        Alert.alert("Success", "User information updated");
        setUserData({ username: "", email: "" });
        setShowModal(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to update user");
        console.error(error);
      });
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    userApi
      .delete(userId)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        Alert.alert("Success", "User has been deleted");
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to delete user");
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUsers();
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
      <Text style={styles.title}> User List</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.addButtonText}>➕ Add User</Text>
      </TouchableOpacity>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Username</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Actions</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.username}</Text>
              <Text style={styles.tableCell}>{item.email}</Text>
              <View style={styles.tableActions}>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentUser(item);
                    setUserData({ username: item.username, email: item.email });
                    setShowModal(true);
                  }}
                >
                  <Text style={styles.editBtn}> Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteUser(item._id)}>
                  <Text style={styles.deleteBtn}> Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal for Add/Edit User */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentUser ? "Edit User" : "Add User"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={userData.username}
              onChangeText={(text) =>
                setUserData({ ...userData, username: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={currentUser ? handleEditUser : handleAddUser}
              >
                <Text style={styles.saveButtonText}>
                  {currentUser ? "Update" : "Add"}
                </Text>
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
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
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
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


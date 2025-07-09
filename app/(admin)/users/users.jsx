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
import { Picker } from "@react-native-picker/picker"; 
import userApi from "../../../services/userApi"; 

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ username: "", email: "", role: "User" });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      console.log("Fetched users:", data);
      setUsers(data.data);
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
      password: "password123", // Mật khẩu mặc định
      role: userData.role,
    };

    userApi
      .create(newUser)
      .then((response) => {
        setUsers((prevUsers) => [response, ...prevUsers]);
        Alert.alert("Success", "User has been added");
        setUserData({ username: "", email: "", role: "User" });
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
      role: userData.role,
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
        setUserData({ username: "", email: "", role: "User" });
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

      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.addButtonText}> Add User</Text>
      </TouchableOpacity> */}

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Username</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Role</Text>
          <Text style={styles.tableHeaderText}>Actions</Text>
                    <Text style={styles.tableHeaderText}>UpdateTime</Text>

        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.username}</Text>
              <Text style={styles.tableCell}>{item.email}</Text>
              <Text style={styles.tableCell}>{item.role}</Text>
                            <Text style={styles.tableCell}>{item.updatedAt}</Text>

              <View style={styles.tableActions}>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentUser(item);
                    setUserData({ username: item.username, email: item.email, role: item.role, updatedAt: item.updatedAt });
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

            <Picker
              selectedValue={userData.role}
              onValueChange={(value) => setUserData({ ...userData, role: value })}
              style={styles.input}
            >
              <Picker.Item label="User" value="User" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>



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
  addButton: {
    backgroundColor: "#f6c169",
    paddingVertical: 10,
    borderRadius: 8,
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
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f6c169",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
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
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  editBtn: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  deleteBtn: {
    color: "#F44336",
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#f9f0e1",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#f6c169",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

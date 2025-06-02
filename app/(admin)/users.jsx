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
import userApi from "../../apis/userApi"; // Đảm bảo đường dẫn đúng

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ username: "", email: "" });

  // Hàm lấy user từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách người dùng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm người dùng
  const handleAddUser = () => {
    const newUser = {
      username: userData.username,
      email: userData.email,
      password: "password123", // Thêm password giả sử
    };

    userApi.create(newUser)
      .then(response => {
        setUsers(prevUsers => [response, ...prevUsers]);
        Alert.alert("Thành công", "Người dùng đã được thêm");
        setUserData({ username: "", email: "" });
        setShowModal(false);
      })
      .catch(error => {
        Alert.alert("Lỗi", "Không thể thêm người dùng");
        console.error(error);
      });
  };

  // Hàm sửa người dùng
  const handleEditUser = () => {
    const updatedUser = {
      username: userData.username,
      email: userData.email,
    };

    userApi.update(currentUser._id, updatedUser)
      .then(response => {
        setUsers(prevUsers => prevUsers.map(user =>
          user._id === currentUser._id ? { ...user, ...updatedUser } : user
        ));
        Alert.alert("Thành công", "Thông tin người dùng đã được cập nhật");
        setUserData({ username: "", email: "" });
        setShowModal(false);
      })
      .catch(error => {
        Alert.alert("Lỗi", "Không thể cập nhật thông tin người dùng");
        console.error(error);
      });
  };

  // Hàm xóa người dùng
  const handleDeleteUser = (userId) => {
    userApi.delete(userId)
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        Alert.alert("Thành công", "Người dùng đã được xóa");
      })
      .catch(error => {
        Alert.alert("Lỗi", "Không thể xóa người dùng");
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
      <Text style={styles.title}>👥 Danh sách người dùng</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>➕ Thêm người dùng</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}  // Dùng _id để đảm bảo unique
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => { setCurrentUser(item); setUserData({ username: item.username, email: item.email }); setShowModal(true); }}>
                <Text style={styles.editBtn}>✏️ Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteUser(item._id)}>
                <Text style={styles.deleteBtn}>🗑️ Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal để thêm/sửa người dùng */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Tên người dùng"
              value={userData.username}
              onChangeText={(text) => setUserData({ ...userData, username: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={currentUser ? handleEditUser : handleAddUser}
              >
                <Text style={styles.saveButtonText}>{currentUser ? "Cập nhật" : "Thêm"}</Text>
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
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editBtn: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  deleteBtn: {
    fontSize: 16,
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

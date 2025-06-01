import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const initialUsers = [
  { id: "1", name: "Nguyễn Văn A", email: "a@example.com" },
  { id: "2", name: "Trần Thị B", email: "b@example.com" },
  { id: "3", name: "Lê Văn C", email: "c@example.com" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);

  const handleAddUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: "Người dùng mới",
      email: "new@example.com",
    };
    setUsers([newUser, ...users]);
  };

  const handleEditUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, name: user.name + " (Đã sửa)" }
          : user
      )
    );
  };

  const handleDeleteUser = (id) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa người dùng này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () =>
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Danh sách người dùng</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Text style={styles.addButtonText}>➕ Thêm người dùng</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEditUser(item.id)}>
                <Text style={styles.editBtn}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
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
    marginBottom: 12,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    fontSize: 18,
    marginRight: 10,
  },
  deleteBtn: {
    fontSize: 18,
    color: "red",
  },
});

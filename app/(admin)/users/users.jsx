import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import userApi from "../../../services/userApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data.data);
    } catch (error) {
      Alert.alert("Error", "Unable to load user list");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      <Text style={styles.title}>User List</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Username</Text>
  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Role</Text>
  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
       <View style={styles.tableRow}>
  <Text style={[styles.tableCell, { flex: 2 }]}>{item.username}</Text>
  <Text style={[styles.tableCell, { flex: 1 }]}>{item.role}</Text>
  <View style={[styles.tableActions, { flex: 1 }]}>
    <TouchableOpacity onPress={() => {
      setSelectedUser(item);
      setDetailModalVisible(true);
    }}>
      <Text style={styles.detailBtn}>Detail</Text>
    </TouchableOpacity>
  </View>
</View>

          )}
        />
      </View>

      {/* Modal hiển thị thông tin chi tiết */}
      <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            {selectedUser && (
              <>
                <Text style={styles.detailText}>Username: {selectedUser.username}</Text>
                <Text style={styles.detailText}>Email: {selectedUser.email}</Text>
                <Text style={styles.detailText}>Role: {selectedUser.role}</Text>
                <Text style={styles.detailText}>
                  Created At:{" "}
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "N/A"}
                </Text>
                {selectedUser.updatedAt && (
                  <Text style={styles.detailText}>
                    Updated At: {new Date(selectedUser.updatedAt).toLocaleString()}
                  </Text>
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setDetailModalVisible(false)}
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
  justifyContent: "center",
  alignItems: "center",
},
  detailBtn: {
    color: "#007bff",
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 20,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

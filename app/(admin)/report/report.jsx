import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from "react-native";
import reportAPIs from "../../../services/reportAPIs";
import postAPIs from "../../../services/postAPIs";
import { AuthContext } from "../../../context/AuthContext";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const { userId } = useContext(AuthContext);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPIs.getAllReports();
      setReports(response.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showDetails = async (report) => {
    setReportDetails(report);
    setShowDetailsModal(true);

    try {
      const res = await postAPIs.getById(report.postId);
      setPostDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch post details", err);
    }
  };

  const handleUpdateStatus = async (action) => {
    try {
      const response = await reportAPIs.update(reportDetails._id, {
        action,
        updateBy: userId,
      });

      Alert.alert("Success", `Report ${action}`);
      setReports((prev) =>
        prev.map((r) =>
          r._id === reportDetails._id ? { ...r, status: action } : r
        )
      );
      setShowDetailsModal(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report List</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Post ID</Text>
        <Text style={styles.tableHeaderText}>Reporter</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.tableHeaderText}>Actions</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.postId}</Text>
            <Text style={styles.tableCell}>{item.reporterId}</Text>
            <Text style={styles.tableCell}>{item.status}</Text>
            <View style={styles.tableActions}>
              <TouchableOpacity onPress={() => showDetails(item)}>
                <Text style={styles.detailBtn}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Details Modal */}
      <Modal visible={showDetailsModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
             <TouchableOpacity
        onPress={() => setShowDetailsModal(false)}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>✖</Text>
      </TouchableOpacity>
            <Text style={styles.modalTitle}>Report Details</Text>

            {reportDetails && (
              <>
                <Text style={styles.detailsText}>Post ID: {reportDetails.postId}</Text>
                <Text style={styles.detailsText}>Reporter ID: {reportDetails.reporterId}</Text>
                <Text style={styles.detailsText}>Status: {reportDetails.status}</Text>
                <Text style={styles.detailsText}>Reason: {reportDetails.reason}</Text>
                <Text style={styles.detailsText}>Description: {reportDetails.description}</Text>
              </>
            )}

            {postDetails && (
              <>
                <Text style={styles.detailsText}>--- Post Details ---</Text>
                <Text style={styles.detailsText}>Title: {postDetails.title}</Text>
                <Text style={styles.detailsText}>Content: {postDetails.content}</Text>

                <View style={styles.imageContainer}>
                  {postDetails.images && postDetails.images.length > 0 ? (
                    postDetails.images.map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img }}
                        style={styles.image}
                      />
                    ))
                  ) : (
                    <Text style={styles.detailsText}>No images</Text>
                  )}
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: "#4CAF50" }]}
                onPress={() => handleUpdateStatus("accepted")}
              >
                <Text style={styles.statusBtnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: "#F44336" }]}
                onPress={() => handleUpdateStatus("rejected")}
              >
                <Text style={styles.statusBtnText}>Reject</Text>
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
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    flex: 1,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
    fontSize: 14,
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  detailBtn: {
    color: "#007bff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
    flexWrap: "wrap",
  },
  statusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  statusBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#888",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    flexGrow: 1,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
  position: "absolute",
  top: 10,
  right: 10,
  padding: 5,
  zIndex: 10,
},
closeButtonText: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#888",
},

});

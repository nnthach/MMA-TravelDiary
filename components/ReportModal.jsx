import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import reportAPIs from "../services/reportAPIs";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function ReportModal({
  openReport,
  setOpenReport,
  reportDataForm,
  setReportDataForm,
}) {
  const { userId } = useContext(AuthContext);

  const handleChange = (name, value) => {
    setReportDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReportPost = async () => {
    console.log("report data", reportDataForm);
    try {
      const res = await reportAPIs.create(reportDataForm);
      console.log("send report res", res.data);
      setOpenReport(false);
      setReportDataForm({
        postId: "",
        reporterId: userId,
        reason: "",
        description: "",
      });
      Alert.alert("Report sended");
    } catch (error) {
      console.log("send report err", error?.response?.data);
      setOpenReport(false);
      setReportDataForm({
        postId: "",
        reporterId: userId,
        reason: "",
        description: "",
      });
      Alert.alert(error?.response?.data?.message);
    }
  };
  return (
    <Modal
      transparent={true}
      visible={openReport}
      animationType="slide"
      onRequestClose={() => setOpenReport(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Report Post</Text>

          <TextInput
            style={styles.input}
            placeholder="Reason (e.g., Spam, Inappropriate)"
            value={reportDataForm.reason}
            onChangeText={(text) => handleChange("reason", text)}
          />

          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description (max 200 characters)"
            value={reportDataForm.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={handleReportPost}
            >
              <Text style={styles.buttonText}>Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setOpenReport(false);
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    textAlignVertical: "top",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  reportButton: {
    flex: 1,
    backgroundColor: "#ff4d4f",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#d9d9d9", // xám sáng
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

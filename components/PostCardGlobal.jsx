import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import storageAPIs from "../services/storageAPIs";
import { SavedPostContext } from "../context/SavedPostContext";
import {
  handleAddPostToStorage,
  handleRemovePostOutOfStorage,
} from "../utils/updateStorage";
import reportAPIs from "../services/reportAPIs";

export default function PostCardGlobal({
  item,
  isSaved = false,
  isOwner = false,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const router = useRouter();
  const { fetchStorageOfUser } = useContext(SavedPostContext);
  const [openReport, setOpenReport] = useState(false);
  const [reportDataForm, setReportDataForm] = useState({
    postId: "",
    reporterId: userId,
    reason: "",
    description: "",
  });

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
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() => {
          router.push(`/post/${item._id}`);
        }}
      >
        {/*Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {item.username}
          </Text>

          {/*Action icon in post */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {isOwner ? (
              <Ionicons
                name="build-outline"
                size={22}
                color="black"
                onPress={(e) => {
                  e.stopPropagation();
                  console.log("edit icon");
                  router.push(`/post/edit/${item._id}`);
                }}
              />
            ) : (
              <>
                {isSaved ? (
                  <Ionicons
                    name="bookmark"
                    size={20}
                    color="black"
                    onPress={() =>
                      handleRemovePostOutOfStorage(
                        userId,
                        item._id,
                        fetchStorageOfUser
                      )
                    }
                  />
                ) : (
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    color="black"
                    onPress={() =>
                      handleAddPostToStorage(
                        userInfo,
                        userId,
                        item._id,
                        fetchStorageOfUser
                      )
                    }
                  />
                )}
                <Ionicons
                  name="alert-circle-outline"
                  size={22}
                  color="black"
                  onPress={() => {
                    const postId = item._id;
                    setReportDataForm((prev) => ({
                      ...prev,
                      postId: postId,
                    }));
                    setOpenReport(true);
                  }}
                />
              </>
            )}
          </View>
        </View>

        <Text style={{ color: "grey", fontSize: 12 }}>{item.createdAt}</Text>
        {/*Content */}
        <View
          style={{
            marginVertical: 5,
            maxHeight: 54,
            overflow: "hidden",
          }}
        >
          <Text style={{ fontWeight: 600 }}>{item.title}</Text>
          <Text>{item.content}</Text>
        </View>
        {/*Image */}
        <View
          style={{
            flex: 1,
            width: "100%",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Image
            source={{
              uri: item?.images[0],
            }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      {/*Modal report */}
      {openReport && (
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
      )}
    </>
  );
}

const styles = {
  container: {
    width: "100%",
    height: 400,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
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
    textAlignVertical: "top", // multiline đẹp hơn
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
    backgroundColor: "#ff4d4f", // đỏ
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
};

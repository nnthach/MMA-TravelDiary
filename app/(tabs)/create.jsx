import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import postAPIs from "../../services/postAPIs";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "expo-router";

const CreateScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const [createForm, setCreateForm] = useState({
    title: "",
    content: "",
    province: "",
    district: "",
    ward: "",
    images: [],
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState("province");

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.vnappmob.com/api/v2/province/"
      );
      setProvinces(response.data.results);
    } catch (error) {
      setError("Failed to fetch provinces");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.vnappmob.com/api/v2/province/district/${provinceId}`
      );
      setDistricts(response.data.results);
      setWards([]);
    } catch (error) {
      setError("Failed to fetch districts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtId) => {
    if (!districtId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.vnappmob.com/api/v2/province/ward/${districtId}`
      );
      setWards(response.data.results);
    } catch (error) {
      setError("Failed to fetch wards");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, field) => {
    setCreateForm({ ...createForm, [field]: value });
  };

  const handlePickerSelect = (item) => {
    if (currentPicker === "province") {
      handleChange(item.province_name, "province"); // Lưu tên tỉnh
      fetchDistricts(item.province_id);
    } else if (currentPicker === "district") {
      handleChange(item.district_name, "district"); // Lưu tên huyện
      fetchWards(item.district_id);
    } else if (currentPicker === "ward") {
      handleChange(item.ward_name, "ward"); // Lưu tên xã
    }
    setModalVisible(false);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCreateForm({
        ...createForm,
        images: [...createForm.images, result.assets[0].uri],
      });
    }
  };

  const handleSubmit = async () => {
    if (!createForm.title || !createForm.content) {
      Alert.alert("Error", "Title and content are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newCreateData = {
        ...createForm,
        userId: userInfo._id,
        username: userInfo.username,
      };
      console.log("create data send", newCreateData);
      const response = await postAPIs.create(newCreateData);
      console.log("create res", response);
      Alert.alert("Success", "Post created successfully!");
      setCreateForm({
        title: "",
        content: "",
        province: "",
        district: "",
        ward: "",
        images: [],
      });
    } catch (err) {
      setError("Error creating post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Create Your Post</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={createForm.title}
          onChangeText={(text) => handleChange(text, "title")}
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Content"
          value={createForm.content}
          multiline
          onChangeText={(text) => handleChange(text, "content")}
        />

        {/* Select Province */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setCurrentPicker("province");
            setModalVisible(true);
          }}
        >
          <Text style={styles.pickerText}>
            {createForm.province || "Select Province"}
          </Text>
        </TouchableOpacity>

        {/* Select District */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setCurrentPicker("district");
            setModalVisible(true);
          }}
        >
          <Text style={styles.pickerText}>
            {createForm.district || "Select District"}
          </Text>
        </TouchableOpacity>

        {/* Select Ward */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setCurrentPicker("ward");
            setModalVisible(true);
          }}
        >
          <Text style={styles.pickerText}>
            {createForm.ward || "Select Ward"}
          </Text>
        </TouchableOpacity>

        {/* Add Images */}
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={{ color: "black" }}>Add Images</Text>
        </TouchableOpacity>

        {createForm.images.length > 0 && (
          <View style={styles.imagePreview}>
            {createForm.images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.image}
              />
            ))}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Post</Text>
          )}
        </TouchableOpacity>

        {/* Modal for Picker */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <FlatList
              data={
                currentPicker === "province"
                  ? provinces
                  : currentPicker === "district"
                  ? districts
                  : wards
              }
              keyExtractor={(item) =>
                item[
                  currentPicker === "province"
                    ? "province_id"
                    : currentPicker === "district"
                    ? "district_id"
                    : "ward_id"
                ]
              }
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePickerSelect(item)}>
                  <Text style={styles.modalItem}>
                    {
                      item[
                        currentPicker === "province"
                          ? "province_name"
                          : currentPicker === "district"
                          ? "district_name"
                          : "ward_name"
                      ]
                    }
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      {!userInfo && (
        // Modal require login before use
        <View style={styles.overlay}>
          <View style={styles.modalWrap}>
            <Text>You need to login before you can create a diary entry.</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "orange",
                width: "40%",
                alignSelf: "flex-end",
                borderRadius: 10,
                marginTop: 20,
              }}
              onPress={() => navigation.navigate("(auth)/login")}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingVertical: 5,
                }}
              >
                Let's login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  textarea: { height: 100, textAlignVertical: "top" },
  pickerButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  pickerText: { color: "#000" },
  imageButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  imagePreview: { flexDirection: "row", marginBottom: 20 },
  image: { width: 100, height: 100, margin: 5, borderRadius: 5 },
  button: {
    backgroundColor: "#ff7733",
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 18 },
  errorText: { color: "red", marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  closeModal: { padding: 10, color: "blue" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalWrap: {
    position: "absolute",
    width: "70%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    padding: 20,
  },
});

export default CreateScreen;
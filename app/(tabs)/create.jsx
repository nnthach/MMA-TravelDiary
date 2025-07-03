import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Import Picker đúng cách
import DropDownPicker from "react-native-dropdown-picker";
import SelectDropdown from "react-native-select-dropdown";

const CreateScreen = () => {
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
  console.log("provinces", provinces);

  useEffect(() => {
    fetchProvinces();
  }, []);

  // LOCATION
  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.vnappmob.com/api/v2/province/"
      );
      setProvinces(
        response.data.results.map((item) => ({
          label: item.province_name,
          value: item.province_name,
        }))
      );
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch provinces");
      setLoading(false);
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
      setLoading(false);
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
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (provinceId) => {
    handleChange(provinceId, "province");
    fetchDistricts(provinceId);
  };

  const handleDistrictChange = (districtId) => {
    handleChange(districtId, "district");
    fetchWards(districtId);
  };

  const handleWardChange = (wardId) => {
    handleChange(wardId, "ward");
  };
  // END LOCATION

  const handleChange = (value, name) => {
    setCreateForm({
      ...createForm,
      [name]: value,
    });
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
    console.log("create form", createForm);
    if (!createForm.title || !createForm.content) {
      Alert.alert("Error", "Title and content are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/posts",
        createForm
      ); // Đảm bảo URL API đúng
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
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <SelectDropdown
        data={provinces}
        defaultButtonText="Select City"
        onSelect={(selectedItem) => {
          handleProvinceChange(selectedItem.label);
        }}
        buttonTextAfterSelection={(selectedItem) => selectedItem.label}
        rowTextForSelection={(item) => item.label}
        buttonStyle={{
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          marginBottom: 20,
          borderRadius: 5,
          height: 50,
        }}
        dropdownStyle={{ backgroundColor: "#eee" }}
        rowStyle={{ borderBottomWidth: 1, borderColor: "#ddd" }}
      />

      {/* Add Images */}
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={{ color: 'black' }}>Add Images</Text>
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
    </ScrollView>
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
  picker: {
    backgroundColor: "red",
    width: "100%",
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff7733",
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 18 },
  imageButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  imagePreview: { flexDirection: "row", marginBottom: 20 },
  image: { width: 100, height: 100, margin: 5, borderRadius: 5 },
  errorText: { color: "red", marginBottom: 10 },
});

export default CreateScreen;
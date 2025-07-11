import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useContext, useState } from "react";
import postAPIs from "../../../../services/postAPIs";
import { AuthContext } from "../../../../context/AuthContext";
import { changeInputUtils } from "../../../../utils/formUtils";
import { pickImage, removeImage } from "../../../../utils/imagePickerUtils";
import uploadImage from "../../../../utils/uploadImage";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function EditPost() {
  const route = useRouter();
  const { id } = useLocalSearchParams();
  const { userId } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState("province");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const initialForm = {
    title: "",
    content: "",
    province: "",
    district: "",
    ward: "",
  };
  const [editData, setEditData] = useState(initialForm);

  const handleChange = changeInputUtils(setEditData);

  const fetchDistricts = async (provinceId) => {
    try {
      const res = await axios.get(
        `https://api.vnappmob.com/api/v2/province/district/${provinceId}`
      );
      setDistricts(res.data.results);
      setWards([]);
    } catch (err) {
      console.error("Failed to fetch districts", err);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const res = await axios.get(
        `https://api.vnappmob.com/api/v2/province/ward/${districtId}`
      );
      setWards(res.data.results);
    } catch (err) {
      console.error("Failed to fetch wards", err);
    }
  };

  const handlePickerSelect = (item) => {
    if (currentPicker === "province") {
      handleChange(item.province_name, "province");
      fetchDistricts(item.province_id);
    } else if (currentPicker === "district") {
      handleChange(item.district_name, "district");
      fetchWards(item.district_id);
    } else if (currentPicker === "ward") {
      handleChange(item.ward_name, "ward");
    }
    setModalVisible(false);
  };

  const handlePickImage = async () => {
    const newAssets = await pickImage();
    setNewImages((prev) => [...prev, ...newAssets]);
  };

  const handleRemoveImage = (index, type = "old") => {
    if (type === "old") {
      setImages((prev) => removeImage(prev, index));
    } else {
      setNewImages((prev) => removeImage(prev, index));
    }
  };

  const handleUpdate = async () => {
    try {
      const imageUrlList = [];

      for (const img of newImages) {
        const url = await uploadImage(img);
        imageUrlList.push(url);
      }

      const allImages = [...images, ...imageUrlList];

      const newEditData = {
        ...editData,
        images: allImages,
        userId,
      };

      await postAPIs.update(id, newEditData);
      alert("Update successfully");
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (error) {
      console.log("update error", error);
    }
  };

  const getPostById = async () => {
    setIsLoading(true);
    try {
      const res = await postAPIs.getById(id);
      const { title, content, province, district, ward } = res.data;

      setEditData({ title, content, province, district, ward });
      setImages(res.data.images);

      // Gọi thêm:
      const selectedProvince = await axios.get(
        "https://api.vnappmob.com/api/v2/province/"
      );
      const matchedProvince = selectedProvince.data.results.find(
        (p) => p.province_name === province
      );
      if (matchedProvince) {
        await fetchDistricts(matchedProvince.province_id);

        const selectedDistrict = await axios.get(
          `https://api.vnappmob.com/api/v2/province/district/${matchedProvince.province_id}`
        );
        const matchedDistrict = selectedDistrict.data.results.find(
          (d) => d.district_name === district
        );
        if (matchedDistrict) {
          await fetchWards(matchedDistrict.district_id);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get("https://api.vnappmob.com/api/v2/province/");
      setProvinces(res.data.results);
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProvinces();
      getPostById();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/*Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => route.back()}
          style={styles.headerIconBack}
        />
        <Text style={styles.headerTitle}>Edit Post</Text>
      </View>

      {/*Body */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={editData.title}
          onChangeText={(text) => handleChange(text, "title")}
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Content"
          value={editData.content}
          multiline
          onChangeText={(text) => handleChange(text, "content")}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setCurrentPicker("province");
            setModalVisible(true);
          }}
        >
          <Text>{editData.province || "Select Province"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setCurrentPicker("district");
            setModalVisible(true);
          }}
        >
          <Text>{editData.district || "Select District"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setCurrentPicker("ward");
            setModalVisible(true);
          }}
        >
          <Text>{editData.ward || "Select Ward"}</Text>
        </TouchableOpacity>

        {/*Add img */}
        <View style={styles.addImgWrapArea}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrap}>
              <TouchableOpacity onPress={() => console.log("img open")}>
                <Image
                  source={{ uri: img }}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
              <Ionicons
                name="close-sharp"
                size={24}
                color="black"
                style={{ position: "absolute", top: 0, right: 0 }}
                onPress={() => handleRemoveImage(index, "old")}
              />
            </View>
          ))}

          {newImages.map((img, index) => (
            <View key={index} style={styles.imageWrap}>
              <TouchableOpacity onPress={() => console.log("img open")}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
              <Ionicons
                name="close-sharp"
                size={24}
                color="black"
                style={{ position: "absolute", top: 0, right: 0 }}
                onPress={() => handleRemoveImage(index, "new")}
              />
            </View>
          ))}
          {images.length + newImages.length < 5 && (
            <TouchableOpacity
              style={styles.addImgBtn}
              onPress={handlePickImage}
            >
              <Text>Add image</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
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
                <Text style={{ padding: 15 }}>
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
            <Text style={{ color: "blue", textAlign: "center", padding: 10 }}>
              Close
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
  headerIconBack: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  headerTitle: {
    width: "100%",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    color: "black",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "pink",
    padding: 8,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  imageWrap: {
    position: "relative",
    width: 100,
    height: 100,
    margin: 5,
    backgroundColor: "lightgrey",
  },
  addImgWrapArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "80%",
  },
  addImgBtn: {
    backgroundColor: "lightgrey",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

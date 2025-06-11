import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import postAPIs from "../../services/postAPIs";
import * as ImagePicker from "expo-image-picker";
import uploadImage from "../../utils/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CreateScreen() {
  const router = useRouter();
  const { userInfo } = useContext(AuthContext);
  const initialForm = {
    title: "",
    content: "",
  };
  const [createForm, setCreateForm] = useState(initialForm);
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  const handleRemoveImage = (imgIndex) => {
    setImages((prev) => prev.filter((_, index) => index !== imgIndex));
  };

  const handleChange = (value, name) => {
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const imageUrlList = [];

      for (const img of images) {
        const url = await uploadImage(img); // upload tung anh len firebase
        imageUrlList.push(url);
      }
      const newCreateForm = {
        ...createForm,
        images: imageUrlList,
        userId: userInfo._id,
        username: userInfo.username,
      };

      const res = await postAPIs.create(newCreateForm);
      alert("Create success");
      setCreateForm(initialForm);
      setImages([]);
    } catch (error) {
      console.log("error create post", error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <LinearGradient
            style={styles.backgroundGradient}
            colors={["#ff7733", "#ffb533", "#ffca33"]}
          >
            <View style={styles.formWrap}>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                Let's create your diary
              </Text>
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

              {/*Add img */}
              <TouchableOpacity style={{ backgroundColor: "red" }}>
                <Text onPress={pickImage}>Add an image from camera</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {images.map((img, index) => (
                  <View
                    key={index}
                    style={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      margin: 5,
                    }}
                  >
                    <Image
                      source={{ uri: img.uri }}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <Ionicons
                      name="close-sharp"
                      size={24}
                      color="black"
                      style={{ position: "absolute", top: 0, right: 0 }}
                      onPress={() => handleRemoveImage(index)}
                    />
                  </View>
                ))}
              </View>

              {/*Submit */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/*Modal require login before use */}
        {!userInfo && (
          <View style={styles.overlay}>
            <View style={styles.modalWrap}>
              <Text>
                You need to login before you can create a diary entry.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "orange",
                  width: "40%",
                  alignSelf: "flex-end",
                  borderRadius: 10,
                  marginTop: 20,
                }}
                onPress={() => router.push("/login")}
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
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  formWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    color: "white",
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

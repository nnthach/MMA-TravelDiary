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
import uploadImage from "../../utils/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { pickImage, removeImage } from "../../utils/imagePickerUtils";
import { changeInputUtils } from "../../utils/formUtils";
import ModalAlert from "../../components/ModalAlert";

export default function CreateScreen() {
  const router = useRouter();
  const { userInfo } = useContext(AuthContext);
  const initialForm = {
    title: "",
    content: "",
  };
  const [createForm, setCreateForm] = useState(initialForm);
  const [images, setImages] = useState([]);

  const handleChange = changeInputUtils(setCreateForm);

  const handlePickImage = async () => {
    const newAssets = await pickImage();
    setImages((prev) => [...prev, ...newAssets]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => removeImage(prev, index));
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

      await postAPIs.create(newCreateForm);
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
                <Text onPress={handlePickImage}>Add an image from camera</Text>
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
          <ModalAlert
            content={"You need to login before you can create a diary entry."}
            onPress={() => router.push("/login")}
            acceptBtn
            acceptBtnText={"Let's login"}
          />
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
});

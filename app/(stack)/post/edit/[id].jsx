import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
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

export default function EditPost() {
  const route = useRouter();
  const { id } = useLocalSearchParams();
  const { userId } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  console.log("old img", images);
  console.log("new img", newImages);

  const initialForm = {
    title: "",
    content: "",
  };
  const [editData, setEditData] = useState(initialForm);

  useFocusEffect(
    useCallback(() => {
      const getPostById = async () => {
        setIsLoading(true);
        try {
          const res = await postAPIs.getById(id);
          setEditData({
            title: res.data.title,
            content: res.data.content,
          });
          setImages(res.data.images);
          setIsLoading(false);
        } catch (error) {
          console.log("error", error);
          setPostDetail(null);
          setIsLoading(false);
        }
      };
      getPostById();
    }, [])
  );

  const handleChange = changeInputUtils(setEditData);

  const handlePickImage = async () => {
    const newAssets = await pickImage();
    setNewImages((prev) => [...prev, ...newAssets]);
  };

  const handleRemoveImage = (index, type = "old") => {
    if (type == "old") {
      setImages((prev) => removeImage(prev, index));
    } else {
      setNewImages((prev) => removeImage(prev, index));
    }
  };

  const handleUpdate = async () => {
    try {
      const imageUrlList = [];

      for (const img of newImages) {
        const url = await uploadImage(img); // upload tung anh len firebase
        imageUrlList.push(url);
      }

      // anh cu va moi
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

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
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
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={editData?.title}
          onChangeText={(text) => handleChange(text, "title")}
        />

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Content"
          value={editData?.content}
          multiline
          onChangeText={(text) => handleChange(text, "content")}
        />

        {/*Add img */}
        <TouchableOpacity style={{ backgroundColor: "red" }}>
          <Text onPress={handlePickImage}>Add an image from camera</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
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
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </>
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
    fontWeight: 500,
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

  imageWrap: {
    position: "relative",
    width: 100,
    height: 100,
    margin: 5,
    backgroundColor: "lightgrey",
  },
});

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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

export default function EditPost() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const { userId } = useContext(AuthContext);
  const route = useRouter();
  const initialForm = {
    title: "",
    content: "",
  };
  const [editData, setEditData] = useState(initialForm);

  console.log("post detail", postDetail);

  useFocusEffect(
    useCallback(() => {
      const getPostById = async () => {
        setIsLoading(true);
        try {
          const res = await postAPIs.getById(id);
          setPostDetail(res.data);
          setEditData({
            title: res.data.title,
            content: res.data.content,
          });
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

  const handleChange = (value, name) => {
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      console.log("editdata", editData);
      console.log("id send", id);
      const newEditData = {
        ...editData,
        userId,
      };
      const res = await postAPIs.update(id, newEditData);
      console.log("update post res", res);
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
          style={{
            position: "absolute",
            left: 10,
            zIndex: 1,
          }}
        />

        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          Edit Post
        </Text>
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
});

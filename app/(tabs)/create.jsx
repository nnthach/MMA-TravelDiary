import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import postAPIs from "../../services/postAPIs";

export default function CreateScreen() {
  const router = useRouter();
  const initialForm = {
    title: "",
    content: "",
    images: [],
  };
  const [createForm, setCreateForm] = useState(initialForm);

  const { userInfo } = useContext(AuthContext);

  const handleChange = (value, name) => {
    if (name == "images") {
      setCreateForm((prev) => ({
        ...prev,
        images: [...prev.images, value],
      }));
    } else {
      setCreateForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async () => {
    try {
      const newCreateForm = {
        ...createForm,
        userId: userInfo._id,
        username: userInfo.username,
      };
      const res = await postAPIs.create(newCreateForm);
      alert("Create success");
      setCreateForm(initialForm);
    } catch (error) {
      console.log("error create post", error);
    }
  };
  return (
    <>
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
              style={styles.input}
              placeholder="Images"
              value={createForm.images}
              onChangeText={(text) => handleChange(text, "images")}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Content"
              value={createForm.content}
              multiline
              onChangeText={(text) => handleChange(text, "content")}
            />

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
            <Text>You need to login before you can create a diary entry.</Text>
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
    </>
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

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateScreen() {
  const [createForm, setCreateForm] = React.useState({
    title: "",
    address: "",
    note: "",
  });

  const handleChange = (value, name) => {
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    console.log(createForm);
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
              placeholder="Address"
              value={createForm.address}
              onChangeText={(text) => handleChange(text, "address")}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Note"
              value={createForm.note}
              multiline
              onChangeText={(text) => handleChange(text, "note")}
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
            onPress={() => console.log("Navigate to login")}
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

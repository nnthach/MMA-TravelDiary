import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";

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
    <View>
      <Text style={{ textAlign: "center" }}>Let's create your diary</Text>
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
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
          Create
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    margin: 10,
    borderRadius: 5,
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
  },
});

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../../../context/AuthContext";
import userApi from "../../../services/userApi";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function Index() {
  const route = useRouter();
  const { userId, userInfo, fetchUser, handleLogout } = useContext(AuthContext);
  const [updateData, setUpdateData] = useState({
    password: "",
    email: userInfo.email,
    oldPassword: "",
    avatar: userInfo.avatar,
  });
  const [error, setError] = useState({
    password: "",
    oldPassword: "",
    email: "",
  });

  const validateInput = () => {
    const newError = {
      password: "",
      oldPassword: "",
      email: "",
    };
    let isValid = true;

    if (!updateData.email) {
      newError.email = "Email is required";
      isValid = false;
    }

    if (updateData.password !== "") {
      if (updateData.password.length < 6 || updateData.password.length > 20) {
        newError.password = "Password must be 6-20 characters.";
        isValid = false;
      }
    }

    if (updateData.oldPassword !== "") {
      if (
        updateData.oldPassword.length < 6 ||
        updateData.oldPassword.length > 20
      ) {
        newError.oldPassword = "Password must be 6-20 characters.";
        isValid = false;
      }
    }

    setError(newError);
    return isValid;
  };

  const handleChange = (value, name) => {
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUpdateData((prev) => ({
        ...prev,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const handleUpdateUser = async () => {
    if (!validateInput()) return;

    if (updateData.oldPassword != "" || updateData.password != "") {
      if (updateData.oldPassword === updateData.password) {
        Alert.alert("Your new password same with old password");
        return;
      }
    }

    try {
      const dataToUpdate = {};

      for (const key in updateData) {
        if (
          updateData[key] !== "" && // bỏ qua field rỗng
          updateData[key] !== userInfo[key] // bỏ qua nếu không thay đổi
        ) {
          dataToUpdate[key] = updateData[key];
        }
      }

      // Nếu không có gì thay đổi thì không gọi API
      if (Object.keys(dataToUpdate).length === 0) {
        Alert.alert("No changes");
        return;
      }

      console.log("update data", dataToUpdate);

      const updateRes = await userApi.update(userId, dataToUpdate);
      await fetchUser();
      Alert.alert("Update successful!");
      setUpdateData((prev) => ({
        ...prev,
        password: "",
        email: "",
        oldPassword: "",
      }));
      if ("password" in dataToUpdate) {
        handleLogout();
        route.replace("/(auth)/login");
      }
    } catch (error) {
      console.log("update error", error);
      Alert.alert(error.response.data.message || "Update fail!");
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f6c169",
      }}
    >
      <View style={styles.wrap}>
        <KeyboardAvoidingView
          style={styles.wrap}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <View>
            <View
              style={{
                backgroundColor: "grey",
                width: 150,
                height: 150,
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: updateData.avatar }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity onPress={handleImagePick}>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Change Avatar
              </Text>
            </TouchableOpacity>
            {updateData.avatar && (
              <TouchableOpacity
                onPress={() =>
                  setUpdateData((prev) => ({
                    ...prev,
                    avatar: "",
                  }))
                }
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Remove Avatar
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={updateData.email}
            onChangeText={(text) => handleChange(text, "email")}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {error.email && (
            <View
              style={{
                justifyContent: "flex-start",
                width: 300,
              }}
            >
              <Text style={styles.errorMsg}>{error.email}</Text>
            </View>
          )}

          <TextInput
            placeholder="Old Password"
            style={styles.input}
            value={updateData.oldPassword}
            onChangeText={(text) => handleChange(text, "oldPassword")}
            secureTextEntry
          />
          {error.oldPassword && (
            <View
              style={{
                justifyContent: "flex-start",
                width: 300,
              }}
            >
              <Text style={styles.errorMsg}>{error.oldPassword}</Text>
            </View>
          )}

          <TextInput
            placeholder="New Password"
            style={styles.input}
            value={updateData.password}
            onChangeText={(text) => handleChange(text, "password")}
            secureTextEntry
          />
          {error.password && (
            <View
              style={{
                justifyContent: "flex-start",
                width: 300,
              }}
            >
              <Text style={styles.errorMsg}>{error.password}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  item: {
    padding: 12,
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    padding: 12,
    width: 300,
  },
  errorMsg: {
    color: "red",
    marginTop: -14,
    marginBottom: 0,
    fontSize: 12,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 24,
    width: 300,
  },
  buttonText: {
    color: "#f3997c",
    fontWeight: "bold",
  },
});

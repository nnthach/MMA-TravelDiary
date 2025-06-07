import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import userApi from "../../services/userApi";

export default function RegisterScreen({ navigation }) {
  const router = useRouter();

  const [registerForm, setLoginForm] = useState({
    username: "",
    password: "",
    email: "",
    confirm_password: "",
  });

  const handleChange = (value, name) => {
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      const res = await userApi.register(registerForm);
      console.log("res", res);

      alert("Register success");

      setTimeout(() => {
        router.push("/(auth)/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("fail to register");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={registerForm.username}
        onChangeText={(text) => handleChange(text, "username")}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={registerForm.email}
        onChangeText={(text) => handleChange(text, "email")}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={registerForm.password}
        onChangeText={(text) => handleChange(text, "password")}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={registerForm.confirm_password}
        onChangeText={(text) => handleChange(text, "confirm_password")}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.link, { marginLeft: 4 }]}>Login</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{ textAlign: "center", marginTop: 5 }}
        onPress={() => router.back()}
      >
        Back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ff7733",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

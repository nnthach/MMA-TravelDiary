import React, { useContext, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
  });
  const { setUserId } = useContext(AuthContext);

  const handleChange = (value, name) => {
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    console.log("start login");
    try {
      console.log("login data", loginForm);
      const res = await userApi.login(loginForm);
      console.log("res login", res);
      const { accessToken, refreshToken } = res.data;

      setUserId(res.data.userId);

      AsyncStorage.setItem("accessToken", accessToken);
      AsyncStorage.setItem("refreshToken", refreshToken);
      AsyncStorage.setItem("userId", res.data.userId);

      alert("login success");

      setTimeout(() => {
        if (res.data.role == "Admin") {
          router.replace("/(admin)");
        } else {
          router.replace("/(tabs)");
        }
      }, 3000);
    } catch (error) {
      console.log("login error", error);
      alert("fail to login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        placeholder="Email or username"
        style={styles.input}
        value={loginForm.account}
        onChangeText={(text) => handleChange(text, "account")}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={loginForm.password}
        onChangeText={(text) => handleChange(text, "password")}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={() => console.log("Forgot Password")}
        style={styles.forgotPassword}
      >
        <Text style={styles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subFooterLink}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={{ fontSize: 14, color: "black", textAlign: "center" }}>
            Continue as Guest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text
            style={{ fontSize: 14, color: "black", textAlign: "center" }}
            onPress={() => router.replace("/")}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  linkText: {
    color: "#007BFF",
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
    marginLeft: 4,
  },
  subFooterLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 15,
  },
});

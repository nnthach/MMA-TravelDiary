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

export default function LoginScreen({ navigation }) {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
  });
  const { setUserId, userId } = useContext(AuthContext);

  const handleChange = (value, name) => {
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    console.log("run api");
    try {
      const res = await userApi.login(loginForm);
      console.log("res", res);
      const { accessToken, refreshToken } = res;

      console.log("userId before set", userId);
      setUserId(res.userId);
      console.log("userId after set", userId);

      AsyncStorage.setItem("accessToken", accessToken);
      AsyncStorage.setItem("refreshToken", refreshToken);
      AsyncStorage.setItem("userId", res.userId);

      alert("login success");

      setTimeout(() => {
        if (res.role == "Admin") {
          router.replace("/(admin)");
        } else {
          router.replace("/(tabs)");
        }
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("fail to login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome back.</Text>

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
          <Text style={[styles.link, { marginLeft: 4 }]}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
        <Text style={{ fontSize: 14, color: "black", textAlign: "center" }}>
          Continue as Guest
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
});

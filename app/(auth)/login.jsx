import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import userApi from "../../services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
  });
  const [error, setError] = useState({
    account: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId } = useContext(AuthContext);

  const validateInput = () => {
    const newError = { account: "", password: "" };
    let isValid = true;

    if (loginForm.account.length < 6 || loginForm.account.length > 20) {
      newError.account = "Account must be 6-20 characters.";
      isValid = false;
    }

    if (loginForm.password.length < 6 || loginForm.password.length > 20) {
      newError.password = "Password must be 6-20 characters.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleChange = (value, name) => {
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (!validateInput()) return;
    setIsLoading(true);
    try {
      const res = await userApi.login(loginForm);
      const { accessToken, refreshToken } = res.data;

      setUserId(res.data.userId);

      AsyncStorage.setItem("accessToken", accessToken);
      AsyncStorage.setItem("refreshToken", refreshToken);
      AsyncStorage.setItem("userId", res.data.userId);

      Alert.alert("Login successfully");

      setIsLoading(false);

      setTimeout(() => {
        if (res.data.role == "Admin") {
          router.replace("/(admin)");
        } else {
          router.replace("/(tabs)");
        }
      }, 1500);
    } catch (error) {
      console.log("login error", error.response.data);
      setLoginForm({ account: "", password: "" });
      Alert.alert(error?.response?.data?.message || "Fail to login");
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={["#f9f0e1", "#f9f0e1", "#f6c169"]}
        style={{ flex: 1, justifyContent: "center" }}
      >
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
          {error.account && (
            <Text style={styles.errorMsg}>{error.account}</Text>
          )}

          <TextInput
            placeholder="Password"
            style={styles.input}
            value={loginForm.password}
            onChangeText={(text) => handleChange(text, "password")}
            secureTextEntry
          />
          {error.password && (
            <Text style={styles.errorMsg}>{error.password}</Text>
          )}

          <TouchableOpacity
            onPress={() => router.push("/forgotPassword")}
            style={styles.forgotPassword}
          >
            <Text style={styles.linkText}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={{ color: "#f3997c" }}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subFooterLink}>
            <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Text
                style={{ fontSize: 14, color: "#f3997c", textAlign: "center" }}
              >
                Continue as Guest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Text
                style={{ fontSize: 14, color: "#f3997c", textAlign: "center" }}
                onPress={() => router.replace("/")}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#f3997c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#f3997c",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorMsg: {
    color: "red",
    marginTop: -14,
    marginBottom: 10,
    fontSize: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  linkText: {
    color: "#ff9900",
  },
  button: {
    backgroundColor: "#f3997c",
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
    color: "#ff9900",
    fontWeight: "bold",
    marginLeft: 4,
  },
  subFooterLink: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 15,
  },
});

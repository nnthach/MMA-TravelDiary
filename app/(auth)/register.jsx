import React, { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const router = useRouter();
  const [error, setError] = useState({
    username: "",
    password: "",
    email: "",
    confirm_password: "",
  });
  const [registerForm, setLoginForm] = useState({
    username: "",
    password: "",
    email: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = () => {
    const newError = {
      username: "",
      password: "",
      email: "",
      confirm_password: "",
    };
    let isValid = true;

    if (registerForm.username.length < 6 || registerForm.username.length > 20) {
      newError.username = "Username must be 6-20 characters.";
      isValid = false;
    }

    if (registerForm.password.length < 6 || registerForm.password.length > 20) {
      newError.password = "Password must be 6-20 characters.";
      isValid = false;
    }

    if (registerForm.confirm_password != registerForm.password) {
      newError.confirm_password = "Confirm password not match.";
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

  const handleRegister = async () => {
    if (!validateInput()) return;
    setIsLoading(true);
    try {
      const res = await userApi.register(registerForm);

      Alert.alert("Register successfully");
      setIsLoading(false);

      setTimeout(() => {
        router.push("/(auth)/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      Alert.alert(error?.response?.data?.message || "Fail to register");
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
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Username"
            style={styles.input}
            value={registerForm.username}
            onChangeText={(text) => handleChange(text, "username")}
          />
          {error.username && (
            <Text style={styles.errorMsg}>{error.username}</Text>
          )}

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={registerForm.email}
            onChangeText={(text) => handleChange(text, "email")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error.email && <Text style={styles.errorMsg}>{error.email}</Text>}

          <TextInput
            placeholder="Password"
            style={styles.input}
            value={registerForm.password}
            onChangeText={(text) => handleChange(text, "password")}
            secureTextEntry
          />
          {error.password && (
            <Text style={styles.errorMsg}>{error.password}</Text>
          )}

          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={registerForm.confirm_password}
            onChangeText={(text) => handleChange(text, "confirm_password")}
            secureTextEntry
          />
          {error.confirm_password && (
            <Text style={styles.errorMsg}>{error.confirm_password}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={{ color: "#f3997c" }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.link}>Sign In</Text>
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

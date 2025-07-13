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
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { setEmailResetPassword } = useContext(AuthContext);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value, name) => {
    setForgotPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = async () => {
    console.log("run forger password");
    setIsLoading(true);
    try {
      const res = await userApi.forgotPassword(forgotPasswordForm);
      console.log("res forget pw", res.data);
      setEmailResetPassword(forgotPasswordForm.email);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/resetPassword");
      }, 2000);
    } catch (error) {
      console.log("forgot password error", error.response.data);
      Alert.alert(error?.response?.data?.message);
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
          <Text style={styles.title}>Forgot Password</Text>

          <TextInput
            placeholder="Enter email"
            style={styles.input}
            value={forgotPasswordForm.email}
            onChangeText={(text) => handleChange(text, "email")}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendEmail}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send</Text>
              )}
            </Text>
          </TouchableOpacity>

          <View style={styles.subFooterLink}>
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Text
                style={{ fontSize: 14, color: "#f3997c", textAlign: "center" }}
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
  subFooterLink: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    gap: 15,
  },
});

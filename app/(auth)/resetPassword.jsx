import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import userApi from "../../services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { emailResetPassword } = useContext(AuthContext);

  console.log("email in reset", emailResetPassword);

  const [resetPasswordForm, setResetPasswordForm] = useState({
    email: emailResetPassword,
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (value, name) => {
    setResetPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    try {
      const { confirmPassword, ...newForm } = resetPasswordForm;
      const res = await userApi.resetPassword(newForm);
      console.log("res reset pw", res);
      Alert.alert("Reset password successfully");
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (error) {
      console.log("reset password error", error);
    }
  };

  return (
    <LinearGradient
      colors={["#f9f0e1", "#f9f0e1", "#f6c169"]}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={{ color: "grey", textAlign: "center", marginBottom: 10 }}>
          OTP sent to your email, please check it!
        </Text>

        <TextInput
          placeholder="Enter OTP"
          style={styles.input}
          value={resetPasswordForm.otp}
          onChangeText={(text) => handleChange(text, "otp")}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={resetPasswordForm.password}
          onChangeText={(text) => handleChange(text, "password")}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          value={resetPasswordForm.confirmPassword}
          onChangeText={(text) => handleChange(text, "confirmPassword")}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Send</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
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

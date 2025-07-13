import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import userApi from "../../services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { emailResetPassword } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [resetPasswordForm, setResetPasswordForm] = useState({
    email: emailResetPassword,
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const validateInput = () => {
    const newError = {
      otp: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (resetPasswordForm.otp.length != 6) {
      newError.otp = "OTP have only 6 characters.";
      isValid = false;
    }

    if (
      resetPasswordForm.password.length < 6 ||
      resetPasswordForm.password.length > 20
    ) {
      newError.password = "Password must be 6-20 characters.";
      isValid = false;
    }

    if (resetPasswordForm.confirmPassword != resetPasswordForm.password) {
      newError.confirmPassword = "Confirm password not match.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleChange = (value, name) => {
    setResetPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResendOtp = async () => {
    console.log("run resend otp ");

    try {
      const res = await userApi.resendOtp({ email: emailResetPassword });
      console.log("resend otp res", res);
      Alert.alert("Check your email");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleResetPassword = async () => {
    if (!validateInput()) return;
    setIsLoading(true);
    try {
      const { confirmPassword, ...newForm } = resetPasswordForm;
      const res = await userApi.resetPassword(newForm);
      console.log("res reset pw", res);
      Alert.alert("Reset password successfully");
      setIsLoading(false);

      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (error) {
      console.log("reset password error", error);
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
          <Text style={styles.title}>Reset Password</Text>
          <Text
            style={{ color: "grey", textAlign: "center", marginBottom: 10 }}
          >
            OTP sent to your email, please check it!
          </Text>

          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            value={resetPasswordForm.otp}
            onChangeText={(text) => handleChange(text, "otp")}
            autoCapitalize="none"
          />
          {error.otp && <Text style={styles.errorMsg}>{error.otp}</Text>}

          <TextInput
            placeholder="Password"
            style={styles.input}
            value={resetPasswordForm.password}
            onChangeText={(text) => handleChange(text, "password")}
            secureTextEntry
          />
          {error.password && (
            <Text style={styles.errorMsg}>{error.password}</Text>
          )}

          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={resetPasswordForm.confirmPassword}
            onChangeText={(text) => handleChange(text, "confirmPassword")}
            secureTextEntry
          />
          {error.confirmPassword && (
            <Text style={styles.errorMsg}>{error.confirmPassword}</Text>
          )}

          <TouchableOpacity
            onPress={() => handleResendOtp()}
            style={styles.forgotPassword}
          >
            <Text style={styles.linkText}>Resend OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
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

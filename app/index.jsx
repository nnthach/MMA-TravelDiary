import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  // return <Redirect href={"/(admin)"} />;

  const router = useRouter();

  return (
    <LinearGradient
      colors={["#f9f0e1", "#f9f0e1", "#f6c169"]}
      style={{ width: "100%", height: "100%" }}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.logoWrapImg}>
          {/* LOGO app */}
          <Image
            source={require("../assets/logo.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 30, color: "orange", fontWeight: "bold" }}>
          Welcome to our diary!
        </Text>
      </View>

      <View style={styles.bottomWrap}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={{ width: "100%", alignItems: "center" }}
        >
          <View style={styles.authButtonWrap}>
            <Text style={styles.authText}>Sign In</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={{ width: "100%", alignItems: "center" }}
        >
          <View style={styles.authButtonWrap}>
            <Text style={styles.authText}>Sign Up</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={{ fontWeight: 500, fontSize: 16, color: "white" }}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logoWrapImg: {
    width: 300,
    height: 300,
    backgroundColor: "red",
    overflow: "hidden",
  },

  bottomWrap: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  authButtonWrap: {
    backgroundColor: "#FBF1E1",
    width: "80%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  authText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f3997c",
  },
});

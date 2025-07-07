import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#f9f0e1", "#f9f0e1", "#f6c169"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
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

        <View style={styles.bottomWrap}>
          {/*SIGN IN */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={{ width: "100%", alignItems: "center" }}
          >
            <View style={styles.authButtonWrap}>
              <Text style={styles.authText}>Sign In</Text>
            </View>
          </TouchableOpacity>

          {/*SIGN UP */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={{ width: "100%", alignItems: "center" }}
          >
            <View style={styles.authButtonWrap}>
              <Text style={styles.authText}>Sign Up</Text>
            </View>
          </TouchableOpacity>

          {/*Or line */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "80%",
              marginVertical: 20,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "#f3997c" }} />
            <Text style={{ paddingHorizontal: 10, color: "#f3997c" }}>OR</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#f3997c" }} />
          </View>

          {/*Google */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={{ width: "100%", alignItems: "center" }}
          >
            <View style={[styles.authButtonWrap, styles.authButtonOtherOption]}>
              <Image
                source={require("../assets/googlelogo.webp")}
                style={{ width: 20, height: 20 }}
                resizeMode="cover"
              />
              <Text style={styles.authText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/*GUEST */}
          <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
            <Text style={{ fontSize: 16, color: "white" }}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logoWrapImg: {
    width: 300,
    height: 300,
    overflow: "hidden",
  },

  bottomWrap: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  authButtonOtherOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  authButtonWrap: {
    // backgroundColor: "#FBF1E1",
    backgroundColor: "white",
    width: "80%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fec1ad",
  },
  authText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f3997c",
  },
});

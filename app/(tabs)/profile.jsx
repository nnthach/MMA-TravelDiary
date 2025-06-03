import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const { userInfo, handleLogout } = useContext(AuthContext);

  if (!userInfo) {
    return (
      <View>
        <Text>Let's sign in first</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <>
      {/*Header */}
      <View style={styles.header}>
        <View
          style={{
            backgroundColor: "grey",
            width: 80,
            height: 80,
            borderRadius: 50,
          }}
        ></View>
        <Text>Username: {userInfo.username}</Text>
        <TouchableOpacity
          onPress={() => {
            console.log("logout");
            handleLogout;
          }}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <Text>Total post</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "red",
  },
});

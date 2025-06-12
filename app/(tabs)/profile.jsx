import { useCallback, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import { Dimensions } from "react-native";
import postAPIs from "../../services/postAPIs";
import PostCardProfile from "../../components/PostCardProfile";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3 - 2;

export default function ProfileScreen() {
  const router = useRouter();
  const { userInfo, handleLogout } = useContext(AuthContext);
  const [postListData, setPostListData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchUserPost = async () => {
        try {
          const res = await postAPIs.getByUserId(userInfo._id);
          console.log("res", res);
          setPostListData(res.data);
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchUserPost();
    }, [])
  );

  if (!userInfo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>
          Let's sign in first
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
            Go to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View
          style={{
            backgroundColor: "lightgrey",
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        >
          <Image
            source={{ uri: userInfo.profileImageURL }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.postsNumWrap}>
          <View style={{ alignItems: "left" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>120</Text>
            <Text style={{ color: "grey" }}>Posts</Text>
          </View>
          <View style={{ alignItems: "left" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>120</Text>
            <Text style={{ color: "grey" }}>Public posts</Text>
          </View>
          <View style={{ alignItems: "left" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>12</Text>
            <Text style={{ color: "grey" }}>Private posts</Text>
          </View>
        </View>
      </View>

      {/* Username and bio */}
      <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {userInfo.username}
        </Text>
        <Text style={{ color: "gray", marginTop: 4 }}>
          These are the places I have been to!
        </Text>
      </View>

      {/* Edit Profile / Share Profile */}
      <View style={styles.buttonActionWrap}>
        <TouchableOpacity style={styles.buttonWrap}>
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrap}>
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            Share Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Admin management button */}
      {userInfo.role === "Admin" && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.managementButton}
            onPress={() => {
              router.replace("/(admin)");
            }}
          >
            <Text style={{ color: "#000", fontWeight: "bold" }}>
              Back to Management
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Post grid (placeholder) */}
      <FlatList
        data={postListData}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <PostCardProfile key={item._id} post={item} />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

{
  /* <TouchableOpacity
          onPress={() => {
            console.log("logout");
            handleLogout();
          }}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 15,
  },

  postsNumWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },

  buttonActionWrap: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 12,
  },

  buttonWrap: {
    flex: 1,
    backgroundColor: "#efefef",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },

  managementButton: {
    flex: 1,
    backgroundColor: "#ffcc00", // Highlight color for admin button
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});

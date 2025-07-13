import { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import postAPIs from "../../services/postAPIs";
import PostCardProfile from "../../components/PostCardProfile";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { userInfo, handleLogout, fetchUser } = useContext(AuthContext);
  const [postListData, setPostListData] = useState([]);
  const [queryPublic, setQueryPublic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDropMenu, setOpenDropMenu] = useState(false);
  // all user post (lay tat ca public n private)
  const [allUserPostData, setAllUserPostData] = useState([]);

  const fetchUserPost = async () => {
    setIsLoading(true);
    try {
      // get public / private
      const res = await postAPIs.getByUserIdAndPublic(
        userInfo._id,
        queryPublic
      );
      setPostListData(res.data);

      //get public & private
      const allUserPost = await postAPIs.getAllUserPosts(userInfo._id);
      setAllUserPostData(allUserPost.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchUserPost();
    }
  }, [userInfo?._id, queryPublic]);

  useFocusEffect(
    useCallback(() => {
      if (userInfo) {
        fetchUserPost();
        fetchUser();
      }
    }, [])
  );

  if (!userInfo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 12,
            color: "#f3997c",
          }}
        >
          Let's sign in first
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          style={{
            backgroundColor: "#f3997c",
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 6,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Go to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/*avatar */}
          <View
            style={{
              backgroundColor: "lightgrey",
              width: 100,
              height: 100,
              borderRadius: 50,
              overflow: "hidden",
            }}
          >
            {userInfo?.avatar && (
              <Image
                source={{ uri: userInfo.avatar }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            )}
          </View>

          <Text style={{ fontWeight: "bold", fontSize: 22 }}>
            {userInfo?.username}
          </Text>

          {/*Number post */}
          <View style={styles.postsNumWrap}>
            <View style={{ alignItems: "center", width: "30%" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {allUserPostData?.length}
              </Text>
              <Text style={{ color: "grey" }}>Posts</Text>
            </View>
            <View style={{ alignItems: "center", width: "30%" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {allUserPostData?.filter((post) => post.public === true).length}
              </Text>
              <Text style={{ color: "grey" }}>Public posts</Text>
            </View>
            <View style={{ alignItems: "center", width: "30%" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {allUserPostData.filter((post) => post.public === false).length}
              </Text>
              <Text style={{ color: "grey" }}>Private posts</Text>
            </View>
          </View>
        </View>

        {/* Edit Profile / Share Profile */}
        <View style={styles.buttonActionWrap}>
          <TouchableOpacity
            style={styles.buttonWrap}
            onPress={() => router.push("/(stack)/editProfile")}
          >
            <Text style={{ color: "#000", fontWeight: "bold" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <View style={{ position: "relative" }}>
            <Ionicons
              name="ellipsis-vertical"
              size={26}
              color="black"
              onPress={() => setOpenDropMenu((prev) => !prev)}
            />

            {openDropMenu && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={{ padding: 5 }}
                  onPress={() => {
                    handleLogout();
                    setOpenDropMenu(false);
                  }}
                >
                  <Text>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Admin management button */}
        {userInfo?.role === "Admin" && (
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

        <View
          style={{
            paddingVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Ionicons
            name="apps"
            size={24}
            color="black"
            onPress={() => setQueryPublic("")}
            style={{
              padding: 5,
              borderBottomColor: "black",
              ...(queryPublic === "" && { borderBottomWidth: 1 }),
            }}
          />
          <Ionicons
            name="eye-outline"
            size={24}
            color="black"
            onPress={() => setQueryPublic("true")}
            style={{
              padding: 5,
              borderBottomColor: "black",
              ...(queryPublic === "true" && { borderBottomWidth: 1 }),
            }}
          />
          <Ionicons
            name="eye-off-outline"
            size={24}
            color="black"
            onPress={() => setQueryPublic("false")}
            style={{
              padding: 5,
              borderBottomColor: "black",
              ...(queryPublic === "false" && { borderBottomWidth: 1 }),
            }}
          />
        </View>

        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="black" />
            <Text>Loading</Text>
          </View>
        ) : (
          <FlatList
            data={postListData}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <PostCardProfile key={item._id} post={item} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  profileHeader: {
    alignItems: "center",
    padding: 16,
    gap: 15,
  },

  postsNumWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  buttonActionWrap: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
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

  dropdownMenu: {
    position: "absolute",
    backgroundColor: "white",
    width: 100,
    height: 50,
    top: 30,
    right: 0,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
  },
});

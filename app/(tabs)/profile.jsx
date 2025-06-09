import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3 - 2; 

export default function ProfileScreen() {
  const router = useRouter();
  const { userInfo, handleLogout } = useContext(AuthContext);

  if (!userInfo) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Let's sign in first</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userInfo.profileImageURL }}
          style={styles.avatar}
        />
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Private posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Public posts</Text>
          </View>
        </View>
      </View>

      {/* Username and bio */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{userInfo.username}</Text>
        <Text style={styles.bio}>These are the places I have been to!</Text>
      </View>

      {/* Edit Profile / Sign Out */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => {/* navigate or open modal */}}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={() => {/* navigate or open modal */}}>
          <Text style={styles.buttonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Post grid (placeholder) */}
      <FlatList
        data={Array.from({ length: 12 })}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ item, index }) => (
          <Image 
            source={require("../assets/icon.png")} 
            style={styles.gridImage} 
          />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 16 
  },

  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  message: { 
    fontSize: 16, 
    marginBottom: 12 
  },

  link: { 
    color: "#007AFF", 
    fontWeight: "bold" 
  },

  profileHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16 
  },

  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginRight: 16 
  },

  stats: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    flex: 1 
  },

  statItem: { 
    alignItems: "center" 
  },

  statNumber: { 
    fontWeight: "bold", 
    fontSize: 16 
  },

  statLabel: { 
    color: "gray" 
  },

  userInfo: { 
    marginBottom: 12 
  },

  username: { 
    fontWeight: "bold", 
    fontSize: 18 
  },

  bio: { 
    color: "gray", 
    marginTop: 4 
  },

  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 12 
  },

  editButton: {
    flex: 1,
    backgroundColor: "#efefef",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },

  shareButton: {
    flex: 1,
    backgroundColor: "#efefef",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },

  buttonText: { 
    color: "#000", 
    fontWeight: "bold" 
  },

  grid: { 
    paddingVertical: 10 
  },

  gridImage: {
    width: imageSize,
    height: imageSize,
    margin: 0.5,
  },
});

import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Slot, usePathname, router } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminLayout() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { handleLogout } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderNavButton = (label, path) => (
    <TouchableOpacity
      onPress={() => router.push(path)}
      style={[
        styles.navButton,
        pathname === path && styles.activeNavButton,
      ]}
    >
      <Text
        style={[
          styles.navButtonText,
          pathname === path && styles.activeNavButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Sidebar */}
       {isSidebarOpen && (
  <LinearGradient
    colors={["#f9f0e1", "#f9f0e1", "#f6c169"]}
    style={styles.sidebar}
  >
    <Text style={styles.logo}>🛠 Admin</Text>

    {/* Navigation Section */}
    <View style={styles.navSection}>
      {renderNavButton("👥 Users", "/(admin)/users/users")}
      {renderNavButton("📝 Posts", "/(admin)/post/post")}
      {renderNavButton("📋 Reports", "/(admin)/report/report")}
    </View>

    {/* Bottom Buttons Section */}
    <View style={styles.bottomButtons}>
      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>🏠 Go Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          handleLogout();
          router.replace("/(auth)/login");
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>🚪 Sign Out</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
)}


        {/* Content */}
        <View style={styles.content}>
          <Pressable onPress={toggleSidebar} style={styles.toggleButton}>
            <Text style={styles.toggleText}>{isSidebarOpen ? "✖" : "☰"}</Text>
          </Pressable>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
 sidebar: {
  width: 138,
  height: "100%",
  paddingTop: 80,
  paddingHorizontal: 15,
  borderRightWidth: 1,
  borderRightColor: "#e0d4b0",
  justifyContent: "space-between", // thêm dòng này nếu bạn không chia View như trên
},
navSection: {
  flex: 1,
},
bottomButtons: {
  marginBottom: 30, // để cách đáy một chút
  alignItems: "flex-start",
  gap: 10,
},

  logo: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 30,
    textAlign: "center",
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 5,
    backgroundColor: "transparent",
  },
  navButtonText: {
    color: "#444",
    fontSize: 16,
  },
  activeNavButton: {
    backgroundColor: "#fff3cd",
  },
  activeNavButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff8dc",
    borderRadius: 6,
  },
  buttonText: {
    color: "#8b0000",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f3f4f6",
  },
toggleButton: {
  position: "absolute",
  top: 20,
  left: 20,
  zIndex: 10,
  padding: 10,
  backgroundColor: "#f6c169", // đổi từ #ddd sang màu chính
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3, // đổ bóng cho Android
},
toggleText: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#fff", // chữ trắng để nổi bật
},

});

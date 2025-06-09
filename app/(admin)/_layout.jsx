import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Slot, Link, usePathname } from "expo-router";

export default function AdminLayout() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <View style={styles.sidebar}>
          <Text style={styles.logo}>🛠 Admin</Text>

          <Link href="/(admin)">
            <Text
              style={[
                styles.link,
                pathname === "/(admin)" && styles.activeLink,
              ]}
            >
              Dashboard
            </Text>
          </Link>

          <Link href="/(admin)/users/users">
            <Text
              style={[
                styles.link,
                pathname === "/(admin)/users/users" && styles.activeLink,
              ]}
            >
              Users
            </Text>
          </Link>

                <Link href="/(admin)/post/post">
            <Text
              style={[
                styles.link,
                pathname === "/(admin)/post/post" && styles.activeLink,
              ]}
            >
              Post
            </Text>
          </Link>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Toggle button */}
        <Pressable onPress={toggleSidebar} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{isSidebarOpen ? "✖" : "☰"}</Text>
        </Pressable>

        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 100,
    backgroundColor: "#1f2937",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 30,
  },
  link: {
    color: "#9ca3af",
    paddingVertical: 10,
    fontSize: 16,
  },
  activeLink: {
    color: "white",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 8,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import postAPIs from "../../services/postAPIs"; // 🔁 Đường dẫn tới file API client

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

export default function BlogScreen() {
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await postAPIs.search({ keyword });
      setPosts(response.data?.data || []); // Nếu API trả về dạng { data: [...], total, page }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => {
        // TODO: Navigate to detail screen
      }}
    >
      <Image
        source={{ uri: item.images?.[0] || "https://via.placeholder.com/150" }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <TextInput
        placeholder="Tìm kiếm bài viết..."
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        style={styles.searchInput}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#555" style={{ marginTop: 20 }} />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          renderItem={renderItem}
          contentContainerStyle={styles.grid}
        />
      ) : searched ? (
        <Text style={styles.noResultText}>Không tìm thấy bài viết nào.</Text>
      ) : (
        <Text style={styles.noResultText}>Nhập từ khóa để tìm kiếm.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    margin: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  grid: {
    padding: 2,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    padding: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  noResultText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
    fontSize: 16,
  },
});

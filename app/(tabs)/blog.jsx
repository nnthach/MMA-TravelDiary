import React, { useState, useEffect, useCallback } from "react";
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
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import postAPIs from "../../services/postAPIs";

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

export default function BlogScreen() {
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const fetchRandomPosts = async () => {
    try {
      const response = await postAPIs.getRandomPosts(30); // Lấy 30 bài random
      setPosts(response.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi tải bài viết ngẫu nhiên:", error);
    }
  };

  // Gọi khi load lần đầu
  useEffect(() => {
    setLoading(true);
    fetchRandomPosts().finally(() => setLoading(false));
  }, []);

  // Tìm kiếm
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await postAPIs.search({ keyword });
      setPosts(response.data?.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Kéo xuống để làm mới
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearched(false); // bỏ trạng thái "đã tìm"
    setKeyword(""); // clear từ khóa
    await fetchRandomPosts();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => router.push(`/post/${item._id}`)}
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
      {/* Tìm kiếm */}
      <TextInput
        placeholder="Tìm kiếm bài viết..."
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        style={styles.searchInput}
      />

      {/* Hiển thị kết quả */}
      {loading ? (
        <ActivityIndicator size="large" color="#555" style={{ marginTop: 20 }} />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          renderItem={renderItem}
          contentContainerStyle={styles.grid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

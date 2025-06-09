import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import postAPIs from "../../../services/postAPIs";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const route = useRouter();
  console.log("post detail", postDetail);
  console.log("post img", postDetail?.images[0]);

  useFocusEffect(
    useCallback(() => {
      const getPostById = async () => {
        setIsLoading(true);
        try {
          const res = await postAPIs.getById(id);
          setPostDetail(res.data);
          setIsLoading(false);
        } catch (error) {
          console.log("error", error);
          setPostDetail(null);
          setIsLoading(false);
        }
      };
      getPostById();
    }, [])
  );

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <>
      {/*Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="black"
          onPress={() => route.back()}
          style={{
            position: "absolute",
            left: 10,
            zIndex: 1,
          }}
        />

        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          {postDetail?.title}
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: "white" }}>
        {/*Post header */}
        <View style={styles.postHeader}>
          <Text style={{ fontWeight: 500, fontSize: 18 }}>
            {postDetail?.username}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="bookmark-outline" size={20} color="black" />
            <Ionicons name="alert-circle-outline" size={22} color="black" />
          </View>
        </View>

        {/*Post Image */}
        <View>
          <View
            style={{
              width: Dimensions.get("window").width,
              height: 350,
              backgroundColor: "lightgrey",
            }}
          >
            <Image
              source={{ uri: `${postDetail?.images[0]}` }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        </View>
        {/*Post content */}
        <View style={styles.postContent}>
          <Text>{postDetail?.content}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  postContent: { paddingHorizontal: 10, paddingVertical: 10 },
});

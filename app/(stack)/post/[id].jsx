import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import postAPIs from "../../../services/postAPIs";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const route = useRouter();

  useFocusEffect(
    useCallback(() => {
      console.log("call detail post------------------------------");
      const getPostById = async () => {
        setIsLoading(true);
        try {
          console.log("call 2", isLoading);
          const res = await postAPIs.getById(id);
          console.log("res", isLoading);
          console.log("res", res);
          setPostDetail(res);
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

      <View>
        <Text>PostDetail {id}</Text>
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
});

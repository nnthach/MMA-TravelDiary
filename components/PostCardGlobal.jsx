import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SavedPostContext } from "../context/SavedPostContext";
import {
  handleAddPostToStorage,
  handleRemovePostOutOfStorage,
} from "../utils/updateStorage";
import ReportModal from "./ReportModal";
import CommentModal from "./CommentModal";

export default function PostCardGlobal({
  item,
  isSaved = false,
  isOwner = false,
}) {
  const { userId, userInfo } = useContext(AuthContext);
  const router = useRouter();
  const { fetchStorageOfUser } = useContext(SavedPostContext);
  const [openReport, setOpenReport] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [reportDataForm, setReportDataForm] = useState({
    postId: "",
    reporterId: userId,
    reason: "",
    description: "",
  });

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.touchAbleWrap}
          onPress={() => {
            router.push(`/post/${item._id}`);
          }}
        >
          {/*Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {item.username}
            </Text>

            {isOwner && (
              <Ionicons
                name="build-outline"
                size={22}
                color="black"
                onPress={(e) => {
                  e.stopPropagation();
                  console.log("edit icon");
                  router.push(`/post/edit/${item._id}`);
                }}
              />
            )}
          </View>

          {/*Create at */}
          <Text style={{ color: "grey", fontSize: 12 }}>
            {new Date(item.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
          {/*Content */}
          <View
            style={{
              marginVertical: 5,
              maxHeight: 54,
              overflow: "hidden",
            }}
          >
            <Text style={{ fontWeight: 600 }}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
          {/*Image */}
          <View
            style={{
              flex: 1,
              width: "100%",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: item?.images[0],
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
        {/*Footer */}
        <View style={styles.footerWrap}>
          {/*Footer left */}
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="heart-outline" size={24} color="black" />
              <Text>120</Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              onPress={() => setOpenComment(true)}
            >
              <Ionicons name="chatbubbles-outline" size={24} color="black" />
              <Text>120</Text>
            </TouchableOpacity>
          </View>

          {/*Footer right */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {!isOwner && (
              <>
                {isSaved ? (
                  <Ionicons
                    name="bookmark"
                    size={20}
                    color="black"
                    onPress={() =>
                      handleRemovePostOutOfStorage(
                        userId,
                        item._id,
                        fetchStorageOfUser
                      )
                    }
                  />
                ) : (
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    color="black"
                    onPress={() =>
                      handleAddPostToStorage(
                        userInfo,
                        userId,
                        item._id,
                        fetchStorageOfUser
                      )
                    }
                  />
                )}
                <Ionicons
                  name="alert-circle-outline"
                  size={22}
                  color="black"
                  onPress={() => {
                    const postId = item._id;
                    setReportDataForm((prev) => ({
                      ...prev,
                      postId: postId,
                    }));
                    setOpenReport(true);
                  }}
                />
              </>
            )}
          </View>
        </View>
      </View>

      {/*Modal report */}
      {openReport && (
        <ReportModal
          openReport={openReport}
          setOpenReport={setOpenReport}
          reportDataForm={reportDataForm}
          setReportDataForm={setReportDataForm}
        />
      )}

      {openComment && (
        <CommentModal
          openComment={openComment}
          setOpenComment={setOpenComment}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 450,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  touchAbleWrap: {
    width: "100%",
    flex: 1,
  },
  footerWrap: {
    marginTop: 10,
    width: "100%",
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

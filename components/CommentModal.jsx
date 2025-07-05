import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CommentModal({ openComment, setOpenComment }) {
  const { userId, userInfo } = useContext(AuthContext);
  const [commentDataForm, setCommentDataForm] = useState({
    userId: "123",
    content: "",
  });

  return (
    <Modal
      visible={openComment}
      animationType="slide"
      transparent
      onRequestClose={() => setOpenComment(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={() => setOpenComment(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View style={{ marginBottom: 15 }}>
              {/*Comment-item-heading */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {userInfo?.username || "guest"}
                </Text>
                <Text style={{ color: "grey" }}>
                  {userInfo?.username || "24/4/2025"}
                </Text>
              </View>
              {/*Comment-item-content */}
              <Text>Ban di coi anh 7 ha</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              {/*Comment-item-heading */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {userInfo?.username || "guest"}
                </Text>
                <Text style={{ color: "grey" }}>
                  {userInfo?.username || "24/4/2025"}
                </Text>
              </View>
              {/*Comment-item-content */}
              <Text>Ban di coi anh 7 ha</Text>
            </View>
          </ScrollView>

          {/*Input comment */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingTop: 10,
            }}
          >
            <View style={{ maxWidth: 45, overflow: "hidden" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {userInfo?.username || "guest"}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Type here"
              value={commentDataForm.content}
              onChangeText={(text) =>
                setCommentDataForm((prev) => ({ ...prev, content: text }))
              }
            />
            <TouchableOpacity
              onPress={() => {
                console.log("comment send", commentDataForm);
                // reset nếu muốn
                setCommentDataForm((prev) => ({ ...prev, content: "" }));
              }}
            >
              <Ionicons name="send" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    height: "65%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flex: 1,
    textAlignVertical: "top",
    fontSize: 14,
  },
});

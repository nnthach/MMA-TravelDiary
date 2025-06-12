import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function ModalAlert({ content, onPress, acceptBtn = true, acceptBtnText }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalWrap}>
        <Text>{content}</Text>
        {acceptBtn && (
          <TouchableOpacity style={styles.buttonAcceptWrap} onPress={onPress}>
            <Text style={styles.buttonAcceptText}>{acceptBtnText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalWrap: {
    position: "absolute",
    width: "70%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    padding: 20,
  },
  buttonAcceptWrap: {
    backgroundColor: "orange",
    width: "40%",
    alignSelf: "flex-end",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonAcceptText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 5,
  },
});

export default ModalAlert;

import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
  });

  if (!result.canceled) {
    return result.assets; // return array of images object
  }
};

export const removeImage = (images, imgIndex) => {
  return images.filter((_, index) => index !== imgIndex);
};

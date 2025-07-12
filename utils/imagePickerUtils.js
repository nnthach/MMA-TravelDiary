import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    // mediaTypes: ["images", "videos"],
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
  });

  if (!result.canceled) {
    return result.assets.map((asset) => ({
      uri: asset.uri,
      type: asset.type?.startsWith("video") ? "video" : "image",
    })); // return array of images object
  }
  return [];
};

export const removeImage = (images, imgIndex) => {
  return images.filter((_, index) => index !== imgIndex);
};

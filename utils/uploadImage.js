import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

// hinh anh nhan vao tu mobile la dang uri
// Blob (viết tắt của Binary Large Object) là một kiểu dữ liệu đại diện cho dữ liệu nhị phân – ví dụ như ảnh, video, file PDF, v.v.
const uriToBlob = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob(); // convert file uri → blob
  return blob;
};

const uploadImage = async (asset) => {
  const blob = await uriToBlob(asset.uri); // call convert
  console.log("blob", blob);
  const storageRef = ref(storage, asset.fileName || `TravelDiary/${Date.now()}.jpg`);
  console.log('storageRef', storageRef)
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  console.log('downloadUrl', downloadURL)
  return downloadURL;
};

export default uploadImage;

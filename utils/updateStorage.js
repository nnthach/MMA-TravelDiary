import storageAPIs from "../services/storageAPIs";

export const handleAddPostToStorage = async (
  userInfo,
  userId,
  postId,
  fetchStorageOfUser
) => {
  if (!userInfo) {
    alert("You need to login");
    return
  }
  try {
    const result = await storageAPIs.create(userId, { postId });
    alert(result.data.message);
    fetchStorageOfUser();
  } catch (error) {
    console.log("add post to storage err", error);
  }
};

export const handleRemovePostOutOfStorage = async (
  userId,
  postId,
  fetchStorageOfUser
) => {

  if (!userId) {
    alert("You need to login");
    return
  }
  try {
    const result = await storageAPIs.delete(userId, postId);
    alert(result.data.message);
    fetchStorageOfUser();
  } catch (error) {
    console.log("remove post form storage err", error);
  }
};

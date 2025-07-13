import { createContext, useState } from "react";
import postAPIs from "../services/postAPIs";

export const PostContext = createContext({});

export const PostProvider = ({ children }) => {
  const [postListData, setPostListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const [postId, setPostId] = useState(null);

  const getAllPost = async () => {
    setIsLoading(true);
    try {
      const res = await postAPIs.getAllPost();
      console.log("get all post res", res.data);
      setPostListData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error get all post", error);
      setIsLoading(false);
    }
  };

  const getPostDetail = async (id) => {
    setIsLoading(true);
    try {
      const res = await postAPIs.getById(id);
      console.log("get pos dtetail res", res.data);
      setPostDetail(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log("get post detail error", error);
      setPostDetail(null);
      setIsLoading(false);
    }
  };

  return (
    <PostContext.Provider
      value={{
        postListData,
        setPostListData,
        isLoading,
        setIsLoading,
        postDetail,
        getAllPost,
        getPostDetail,
        postId, setPostId
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

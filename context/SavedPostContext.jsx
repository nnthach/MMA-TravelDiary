import { createContext, useContext, useEffect, useState } from "react";
import storageAPIs from "../services/storageAPIs";
import { AuthContext } from "./AuthContext";

export const SavedPostContext = createContext({});

export const SavedPostProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [savedPostData, setSavedPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStorageOfUser = async () => {
    if (!userId) return;
    console.log("id before get user", userId);
    try {
      const res = await storageAPIs.getStorageOfUser(userId);
      setSavedPostData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageOfUser();
  }, [userId]);

  return (
    <SavedPostContext.Provider
      value={{ savedPostData, isLoading, fetchStorageOfUser }}
    >
      {children}
    </SavedPostContext.Provider>
  );
};

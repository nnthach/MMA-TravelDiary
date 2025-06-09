import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import userApi from "../services/userApi";
import { useRouter } from "expo-router";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    console.log("run logout");
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "userId"]);
    setUserInfo(null);
    setUserId(null);
    router.replace("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      console.log("id before get user", userId);
      try {
        const user = await userApi.getById(userId);
        console.log("user by id", user);
        setUserInfo(user.data);
      } catch (error) {
        console.error("Error take user", error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{ userInfo, setUserInfo, handleLogout, setUserId, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

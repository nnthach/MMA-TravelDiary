import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarInactiveTintColor: "black",
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          height: 46,
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "earth" : "earth-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="add-circle-outline" size={30} color={color} />
          ),
          tabBarIconStyle: { marginTop: 3 },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "bookmark-sharp" : "bookmark-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

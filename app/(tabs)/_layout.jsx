import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarInactiveTintColor: "black",
        tabBarStyle: {
          height: 50,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="books" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

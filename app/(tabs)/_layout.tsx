import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import icons

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={"black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="(creating)"
        options={{
          title: "Add",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={"black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={"black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="(notifications)"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="notifications-outline"
              size={size}
              color={"black"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

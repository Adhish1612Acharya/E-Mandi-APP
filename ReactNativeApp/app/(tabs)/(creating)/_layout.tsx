import { Tabs, useRouter } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Products from "../(home)/products";
import Cart from "../(home)/cart";
import Dashboard from "../(home)/dashboard";
import Profile from "../(home)/profile";
import Create from "./create";
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetails from "../(home)/productDetails";
import Edit from "./edit";
import YourProducts from "../(home)/yourProducts";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import the icon libra
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import server from "@/server";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export const handleLogOut = async ({ router }: any) => {
  const data = await axios.get(`${server}/api/user/logout`);
  console.log(data.data);
  if (data.data.success && data.data.message === "successLogOut") {
    Alert.alert("SuccessFully Logged Out", "", [
      {
        text: "OK",
        onPress: () => router.push("/"), // Navigate to the 'Home' screen
      },
    ]);
  }
};

export const AppHeader = ({ router }: any) => (
  <View style={styles.headerContainer}>
    <>
      {/* <Image
        source={{
          uri: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6vIq1XHVpjN6bY-ZJUy5QXLq8H3OCUV9150OvDI6JUjIm-XsT_GhzMGy9wks9tzNiSpSzOJY7EhTki7j7dN_25b8k3xelVgp_5BsaZFpLcsOkbCimqN6xMGO7Ls9AijkZnAEAK7vxbYIWIyL73wzKwFAR_WO5DUa33K6UYcNFBSfRBvrHpFu4xuVQ-54/s629/E%20Mandi.png",
        }}
        style={styles.logo}
      /> */}
      <TouchableOpacity
        onPress={() => {
          handleLogOut({ router });
        }}
      >
        <Text style={styles.logoutButton}>Logout</Text>
      </TouchableOpacity>
    </>
  </View>
);

function DrawerScreens() {
  const router = useRouter();
  return (
    <Drawer.Navigator initialRouteName="Add Listing">
      <Drawer.Screen
        name="Add Listing"
        component={Create}
        options={{
          headerTitle: () => <AppHeader router={router} />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add" color={"black"} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Your Products"
        component={YourProducts}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bag" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function HomeLayout() {
  return (
    <Stack.Navigator initialRouteName="products">
      <Stack.Screen
        name="DrawerScreens"
        component={DrawerScreens}
        options={{
          headerShown: false,
        }} // Hide header for the drawer
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          title: "Product Details",
          headerTitle: () => <AppHeader />,
          headerShown: true,
        }} // Customize header title if needed
      />

      <Stack.Screen
        name="edit"
        component={Edit}
        options={{
          title: "Edit Product",
          headerTitle: () => <AppHeader />,
          headerShown: true,
        }} // Customize header title if needed
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 40,
  },
  logoutButton: {
    fontSize: 16,
    color: "#007BFF",
  },
});

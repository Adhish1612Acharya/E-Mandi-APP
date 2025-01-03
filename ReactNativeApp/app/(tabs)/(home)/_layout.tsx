import { Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Cart from "./cart";
import Profile from "./profile";
import Dashboard from "./dashboard";
import Products from "./products";
import ProductDetails from "./productDetails";
import { createStackNavigator } from "@react-navigation/stack";
import Edit from "../(creating)/edit";
import YourProducts from "./yourProducts";
import OrderProduct from "./orderProduct";
import OrderDetails from "../(orders)/orderDetails";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerScreens() {
  return (
    <Drawer.Navigator initialRouteName="Products">
      <Drawer.Screen name="Products" component={Products} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Your Products" component={YourProducts} />
    </Drawer.Navigator>
  );
}

export default function HomeLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerScreens"
        component={DrawerScreens}
        options={{ headerShown: false }} // Hide header for the drawer
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ title: "Product Details" }} // Customize header title if needed
      />

      <Stack.Screen
        name="Edit"
        component={Edit}
        options={{ title: "Edit Product" }} // Customize header title if needed
      />

      <Stack.Screen
        name="PlaceOrder"
        component={OrderProduct}
        options={{ title: "Place Order" }} // Customize header title if needed
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{ title: "Order Details" }} // Customize header title if needed
      />
    </Stack.Navigator>
  );
}

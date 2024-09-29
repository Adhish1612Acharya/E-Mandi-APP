import { Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Products from "../(home)/products";
import Cart from "../(home)/cart";
import Dashboard from "../(home)/dashboard";
import Profile from "../(home)/profile";
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetails from "../(home)/productDetails";
import YourProducts from "../(home)/yourProducts";
import PlacedOrders from "./placedOrders";
import ReceivedOrders from "./receivedOrders";
import OrderDetails from "./orderDetails";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerScreens() {
  return (
    <Drawer.Navigator initialRouteName="Add Listing">
      <Drawer.Screen name="Placed Orders" component={PlacedOrders} />
      <Drawer.Screen name="Received Orders" component={ReceivedOrders} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Your" component={YourProducts} />
    </Drawer.Navigator>
  );
}

export default function HomeLayout() {
  return (
    <Stack.Navigator initialRouteName="products">
      <Stack.Screen
        name="DrawerScreens"
        component={DrawerScreens}
        options={{ headerShown: false }} // Hide header for the drawer
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{ title: "Order Details" }} // Customize header title if needed
      />
    </Stack.Navigator>
  );
}

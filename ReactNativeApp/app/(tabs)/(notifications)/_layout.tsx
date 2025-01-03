import { createDrawerNavigator } from "@react-navigation/drawer";
import Cart from "../(home)/cart";
import Dashboard from "../(home)/dashboard";
import Profile from "../(home)/profile";
import { createStackNavigator } from "@react-navigation/stack";
import YourProducts from "../(home)/yourProducts";
import OrderDetails from "../(orders)/orderDetails";
import ViewNotifications from "./viewNotifications";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerScreens() {
  return (
    <Drawer.Navigator initialRouteName="Add Listing">
      <Drawer.Screen name="Notifications" component={ViewNotifications} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Your Products" component={YourProducts} />
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

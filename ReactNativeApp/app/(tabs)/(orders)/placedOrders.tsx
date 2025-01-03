import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import server from "@/server";
import OrdersCard from "@/app/components/ordersCard";
import { ScrollView } from "react-native-gesture-handler";

const PlacedOrders = () => {
  let [orders, setOrders] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      async function getPlacedOrders() {
        const data = await axios.get(`${server}/api/user/placedOrders`);
        if (data.data.success) {
          setOrders(data.data.placedOrders);
        }
      }
      getPlacedOrders();
    }, [])
  );

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
      }}
    >
      <View>
        {orders.map((order: any) => {
          return <OrdersCard order={order} key={order._id} farmer={false} />;
        })}
      </View>
    </ScrollView>
  );
};

export default PlacedOrders;

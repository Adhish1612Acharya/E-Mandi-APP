import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import server from "@/server";
import OrdersCard from "@/app/components/ordersCard";
import { ScrollView } from "react-native-gesture-handler";

const ReceivedOrders = () => {
  let [orders, setOrders] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      async function getReceivedOrders() {
        const data = await axios.get(`${server}/api/user/receivedOrders`);
        if (data.data.success) {
          console.log(data.data.receivedOrders);
          setOrders(data.data.receivedOrders);
        }
      }
      getReceivedOrders();
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
          return <OrdersCard order={order} key={order._id} farmer={true} />;
        })}
      </View>
    </ScrollView>
  );
};

export default ReceivedOrders;

import { View, Text, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import server from "@/server";
import NotificationsCard from "@/app/components/notificationsCard";

const ViewNotifications = () => {
  let [orders, setOrders] = useState<any>([]);
  let [date, setDate] = useState<any>("");

  useFocusEffect(
    useCallback(() => {
      async function getNotifications() {
        const data = await axios.get(`${server}/api/user/notifications`);

        if (data.data.success) {
          setOrders(data.data.notifications);
        }
      }
      getNotifications();
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
          return (
            <NotificationsCard order={order} key={order._id} date={date} />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ViewNotifications;

import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";

const NotificationsCard = ({ order, date }: any) => {
  const navigation = useNavigation<any>();

  const setDate = (date: any) => {
    const result = new Date(date);

    // Extract the day, month, and year
    const day = String(result.getUTCDate()).padStart(2, "0");
    const month = String(result.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = result.getUTCFullYear();

    // Format the date as dd-mm-yyyy
    return `${day}-${month}-${year}`;
  };
  return (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationDetails}>
        <Text style={styles.productName}>{order.productName}</Text>
        <Text style={styles.senderName}>From: {order.orderedBy.username}</Text>
        <Text style={styles.orderDate}>Date: {setDate(order.date)}</Text>
        <TouchableOpacity
          style={styles.viewOrderButton}
          onPress={() =>
            navigation.navigate("OrderDetails", { id: order._id, farmer: true })
          }
        >
          <Text style={styles.viewOrderButtonText}>View Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  notificationContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notificationDetails: {
    flexDirection: "column",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  viewOrderButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  viewOrderButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NotificationsCard;

import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const OrdersCard = ({ order, farmer }: any) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("OrderDetails", {
          id: order._id,
          farmer: farmer,
        })
      }
      style={{ padding: 10, backgroundColor: "white" }}
    >
      <View style={styles.orderContainer}>
        <Image
          source={{ uri: order.productImage }}
          style={styles.productImage}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.productName}>{order.productName}</Text>
          <Text style={styles.ownerName}>
            Owner:{" "}
            {farmer ? order.orderedBy.username : order.productOwner.username}
          </Text>
          <Text style={styles.totalPrice}>
            Total Price: ₹{order.deliveryPrice + order.productPrice}
          </Text>
          <View
            style={[
              styles.paymentStatus,
              order.paid ? styles.paid : styles.pending,
            ]}
          >
            <Text style={styles.paymentText}>
              Payment Status: {order.paid ? "Paid" : "Pending"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrdersCard;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  orderContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ownerName: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 8,
  },
  paymentStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  paid: {
    backgroundColor: "#28a745",
  },
  pending: {
    backgroundColor: "#ffc107",
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});

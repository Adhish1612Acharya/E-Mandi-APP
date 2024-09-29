import server from "@/server";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const OrderDetails = ({ route }: any) => {
  const { id, farmer } = route.params;
  const [productDetails, setProductDetails] = useState({
    name: "Wireless Earbuds",
    image: "https://example.com/product-image.jpg", // Replace with actual image URL
    price: null,
    deliveryCharge: null,
  });

  const [customerDetails, setCustomerDetails] = useState<any>({
    name: "",
    email: "",
    contactNo: "",
  });

  const [ownerDetails, setOwnerDetails] = useState<any>({
    name: "",
    email: "",
    contactNo: "",
  });

  const [date, setDate] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");

  const [totalPrice, setTotalPrice] = useState<any>("");

  useFocusEffect(
    useCallback(() => {
      async function getOrderDetails() {
        const data = await axios.get(`${server}/api/user/order/${id}`);

        if (data.data.success) {
          const details = data.data.orderDetails;
          console.log("username", details.orderedBy.username);
          setProductDetails({
            name: details.productName,
            image: details.productImage, // Replace with actual image URL
            price: details.productPrice,
            deliveryCharge: details.deliveryPrice,
          });
          setCustomerDetails({
            name: details.orderedBy.username,
            email: details.orderedBy.email,
            contactNo: details.orderedBy.phoneNumber,
            address: details.address,
            pincode: details.pincode,
          });

          setOwnerDetails({
            name: details.productOwner.username,
            email: details.productOwner.email,
            contactNo: details.productOwner.phoneNumber,
          });

          setTotalPrice(details.productPrice + details.deliveryPrice);

          const date = new Date(details.date);

          // Extract the day, month, and year
          const day = String(date.getUTCDate()).padStart(2, "0");
          const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
          const year = date.getUTCFullYear();

          // Format the date as dd-mm-yyyy
          setDate(`${day}-${month}-${year}`);

          if (details.paid) {
            setPaymentStatus("Paid");
          } else {
            setPaymentStatus("Pending");
          }
        }
      }
      getOrderDetails();
    }, [])
  );

  //   // Total price calculation
  //   const totalPrice = productDetails.price + productDetails.deliveryCharge;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Product Details Section */}
      <View style={styles.productContainer}>
        <Image
          source={{ uri: productDetails.image }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{productDetails.name}</Text>
          <Text style={styles.productPrice}>
            Product Price: ₹{productDetails.price}
          </Text>
          <Text style={styles.deliveryCharge}>
            Delivery Charge: ₹{productDetails.deliveryCharge}
          </Text>

          <Text style={styles.orderDate}>Order Date: {date}</Text>
          {!farmer ? (
            <>
              <Text style={styles.deliveryCharge}>
                Your Address: {customerDetails.address}
              </Text>
              <Text style={styles.deliveryCharge}>
                Your Pincode: {customerDetails.pincode}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      {/* Total Price */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price: ₹{totalPrice}</Text>
      </View>

      {/* address and pincode */}
      {!farmer ? (
        <View style={styles.customerContainer}>
          <Text style={styles.customerHeading}>Your Address and Pincode</Text>
          <Text style={styles.customerInfo}>
            Address: {customerDetails.address}
          </Text>
          <Text style={styles.customerInfo}>
            Pincode: {customerDetails.pincode}
          </Text>
        </View>
      ) : null}

      {/* Customer Details */}
      {farmer ? (
        <View style={styles.customerContainer}>
          <Text style={styles.customerHeading}>Ordered By:</Text>
          <Text style={styles.customerInfo}>Name: {customerDetails.name}</Text>
          <Text style={styles.customerInfo}>
            Email: {customerDetails.email}
          </Text>
          <Text style={styles.customerInfo}>
            Contact No: {customerDetails.contactNo}
          </Text>
          <Text style={styles.customerInfo}>
            Address: {customerDetails.address}
          </Text>
          <Text style={styles.customerInfo}>
            Pincode: {customerDetails.pincode}
          </Text>
        </View>
      ) : null}

      {!farmer ? (
        <View style={styles.customerContainer}>
          <Text style={styles.customerHeading}>Product Owner Details : </Text>
          <Text style={styles.customerInfo}>Owner: {ownerDetails.name}</Text>
          <Text style={styles.customerInfo}>Email: {ownerDetails.email}</Text>
          <Text style={styles.customerInfo}>
            Phone: {ownerDetails.contactNo}
          </Text>
        </View>
      ) : null}

      {/* Payment Status */}
      <View
        style={[
          styles.paymentStatus,
          paymentStatus === "Paid" ? styles.paid : styles.pending,
        ]}
      >
        <Text style={styles.paymentText}>Payment Status: {paymentStatus}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
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
  productDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#28a745",
    marginBottom: 8,
  },
  deliveryCharge: {
    fontSize: 14,
    color: "#6c757d",
  },
  productOwner: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 8,
  },
  orderDate: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  totalContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  customerContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  customerHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customerInfo: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 8,
  },
  paymentStatus: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  paid: {
    backgroundColor: "#28a745",
  },
  pending: {
    backgroundColor: "#ffc107",
  },
  paymentText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  ownerEmail: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 4,
  },
  ownerPhone: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 4,
  },
});

export default OrderDetails;

import server from "@/server";
import axios from "axios";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

const OrderProduct = ({ route }: any) => {
  const { id } = route.params;
  const navigation = useNavigation<any>();
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [product, setProduct] = useState<any>({
    name: "",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.RdB6_DvUTVfQa6Gqt-kvtAHaEK&pid=Api&P=0&h=220", // Replace with actual image URL
    price: null,
    deliveryPrice: null,
  });

  useFocusEffect(
    useCallback(() => {
      async function getProductDetails() {
        const data = await axios.get(`${server}/api/listing/${id}`);
        if (data.data.success) {
          const productDetails = JSON.parse(
            JSON.stringify(data.data.productDetail)
          );
          console.log("ownership", data.data.isOwner);
          //   setLoad(false);
          //   setDetails(productDetails);
          //   setOwnership(data.data.isOwner);
          const dp = Math.floor(Math.random() * 50) + 100;
          setProduct({
            name: productDetails.title,
            image: productDetails.image, // Replace with actual image URL
            price: productDetails.price,
            deliveryPrice: dp,
          });
        }
      }
      getProductDetails();
    }, [])
  );

  const handleOrderNow = async () => {
    // Handle order submission logic
    const data = {
      productName: product.name,
      productImage: product.image, // Replace with actual image URL
      productPrice: product.price,
      deliveryPrice: product.deliveryPrice,
      pincode: pincode,
      address: address,
    };
    console.log("Order Placed:", data);

    const response = await axios.post(
      `${server}/api/listing/${id}/order`,
      data
    );
    console.log(response.data);
    if (response.data.success) {
      Alert.alert("Order Placed Successfull", "", [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("OrderDetails", {
              id: response.data.orderId,
              farmer: false,
            });
          },
        },
      ]);
    } else {
      Alert.alert("Some Error Occured , Please Try Again", "", [
        {
          text: "Ok",
        },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Place Your Order</Text>

      {/* Product Details Section */}
      <View style={styles.productContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price}</Text>
          <Text style={styles.deliveryCharge}>
            Delivery Charge: ₹{product.deliveryPrice}
          </Text>
        </View>
      </View>

      {/* Address Input Section */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter delivery address"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />

      {/* Pin Code Input Section */}
      <Text style={styles.label}>Pin Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter pin code"
        keyboardType="numeric"
        value={pincode}
        onChangeText={(text) => setPincode(text)}
      />

      {/* Total Price Section */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Amount: ₹{product.price + product.deliveryPrice}
        </Text>
      </View>

      {/* Order Now Button */}
      <TouchableOpacity style={styles.orderButton} onPress={handleOrderNow}>
        <Text style={styles.orderButtonText}>Order Now</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#495057",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderColor: "#ced4da",
    borderWidth: 1,
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
  orderButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default OrderProduct;

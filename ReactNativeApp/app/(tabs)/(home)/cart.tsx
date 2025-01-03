import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import axios from "axios";
import server from "@/server";
import { TouchableOpacity } from "react-native-gesture-handler";

const Cart = () => {
  const [products, setProducts] = useState<any>([]);
  const navigation = useNavigation<any>();
  useFocusEffect(
    useCallback(() => {
      async function getCartDetails() {
        const data = await axios.get(`${server}/api/user/cart`);
        if (data.data.success) {
          setProducts(data.data.cart);
        }
      }
      getCartDetails();
    }, [])
  );
  return (
    <ScrollView
      style={{
        backgroundColor: "white",
      }}
    >
      {products.map((product: any) => {
        return (
          <View key={product._id} style={styles.cardContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.productName}>{product.title}</Text>
              <Text style={styles.productPrice}>₹{product.price}</Text>

              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() =>
                  navigation.navigate("ProductDetails", { id: product._id })
                }
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};
export default Cart;

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 0.2, // Equivalent to "border: 2px"
    borderColor: "black", // Equivalent to "border: ... solid black"
    borderStyle: "solid", // Optional; solid is the default
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginRight: 8,
  },
  productImage: {
    width: 150,
    height: 150,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: "#28a745",
    marginBottom: 12,
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#dc3545",
    borderRadius: 5,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

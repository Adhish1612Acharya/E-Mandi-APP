import server from "@/server";
import axios from "axios";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const YourProducts = () => {
  let [products, setProducts] = useState<any>([]);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      async function getCartDetails() {
        const data = await axios.get(`${server}/api/user/products`);
        if (data.data.success) {
          setProducts(data.data.products);
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
          <View key={product._id} style={styles.productContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>{product.title}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate("ProductDetails", { id: product._id })
              }
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  productContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  detailsButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default YourProducts;

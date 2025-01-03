import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Button,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Link, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import ProductCard from "@/app/components/productCard";
import axios from "axios";
import server from "@/server";

const Products = () => {
  const [products, setProducts] = useState<any>([]);
  const router = useRouter(); // Initialize router

  useFocusEffect(
    useCallback(() => {
      async function getProducts() {
        const data = await axios.get(`${server}/api/listing`);
        if (data.data.success) {
          setProducts(data.data.products);
        }
      }
      getProducts();
    }, [])
  );

  const handleLogOut = async () => {
    const data = await axios.get(`${server}/api/user/logout`);
    if (data.data.success && data.data.message === "successLogOut") {
      Alert.alert("SuccessFully Logged Out", "", [
        {
          text: "OK",
          onPress: () => router.push("/"), // Navigate to the 'Home' screen
        },
      ]);
    }
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          height: "auto",
          width: "auto",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        {products.map((product: any) => {
          return <ProductCard key={product._id} product={product} />;
        })}
        <Button title="Logout" onPress={() => handleLogOut()} />
      </View>
    </ScrollView>
  );
};

export default Products;

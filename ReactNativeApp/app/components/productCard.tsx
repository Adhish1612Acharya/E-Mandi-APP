import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

const ProductCard = ({ product }: any) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetails", {
          id: product._id,
        })
      }
      style={{ padding: 10, backgroundColor: "white" }}
    >
      <View style={styles.card}>
        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.productImage} />

        {/* Product Information */}
        <View style={styles.infoContainer}>
          {/* Product Name */}
          <Text style={styles.productName}>{product.title}</Text>

          {/* Product Price */}
          <Text style={styles.productPrice}>
            ₹{product.price} / {product.priceType}
          </Text>

          {/* Owner Name */}
          <Text style={styles.ownerName}>Owner: {product.owner.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    margin: 10,
    width: 250,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  ownerName: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProductCard;

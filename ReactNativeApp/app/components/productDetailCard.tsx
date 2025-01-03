import { Alert, Image, StyleSheet, View } from "react-native";
import React from "react";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import axios from "axios";
import server from "@/server";

const ProductDetailCard = ({ product, name, isOwner }: any) => {
  const navigation = useNavigation<any>();

  console.log("productDetail isOwner", isOwner);

  const deleteHandle = async () => {
    const data = await axios.delete(`${server}/api/listing/${product._id}`);
    if (data.data.success) {
      Alert.alert("Deleted Successsfully", "", [
        { text: "OK", onPress: () => navigation.navigate("Products") },
      ]);
    } else {
      Alert.alert("Some error Occured", "Trye again", [{ text: "OK" }]);
    }
  };

  const handleAddToCart = async () => {
    const data = await axios.put(`${server}/api/listing/${product._id}/cart`);
    if (data.data.success) {
      Alert.alert("Added To Your Cart", "", [{ text: "OK" }]);
    } else if (data.data.message === "alreadyInCart" && !data.data.success) {
      Alert.alert("Already In Your Cart", "", [{ text: "OK" }]);
    } else {
      Alert.alert("Some error Occured", "Trye again", [{ text: "OK" }]);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Image source={{ uri: product.image }} style={styles.image} />

        <Title style={styles.title}>{product.title}</Title>
        <Paragraph>{product.description}</Paragraph>
        <Text style={styles.price}>
          Price: ₹{product.price} / {product.priceType}
        </Text>
        {product.negotiate ? (
          <Text style={styles.negotiableBadge}>Negotiable</Text>
        ) : (
          <Text style={styles.negotiableBadge}>Not Negotiable</Text>
        )}
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerText}>
            Owner: {isOwner ? "You are the owner" : name}
          </Text>
          {product.negotiate ? (
            <>
              <Text>Phone: {product.owner.phoneNumber}</Text>
              <Text>Email: {product.owner.email}</Text>
            </>
          ) : null}
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        {isOwner ? (
          <>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Edit", { id: product._id })}
            >
              Edit
            </Button>
            <Button mode="contained" onPress={() => deleteHandle()}>
              Delete
            </Button>
          </>
        ) : null}

        {!isOwner ? (
          <>
            <Button mode="outlined" onPress={() => handleAddToCart()}>
              Add to Cart
            </Button>
            <Button
              mode="outlined"
              onPress={() =>
                navigation.navigate("PlaceOrder", { id: product._id })
              }
            >
              Place Order
            </Button>
          </>
        ) : null}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    marginTop: "auto",
    marginBottom: "auto",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d3557",
    marginVertical: 5,
  },
  ownerInfo: {
    marginVertical: 10,
  },
  ownerText: {
    fontWeight: "bold",
  },
  negotiableBadge: {
    backgroundColor: "#2a9d8f",
    color: "white",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  actions: {
    justifyContent: "space-between",
    marginTop: 15,
    marginRight: 15,
  },
});

export default ProductDetailCard;

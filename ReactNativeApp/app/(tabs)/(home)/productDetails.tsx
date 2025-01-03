import { View, Text, Button, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { Link, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import server from "@/server";
import ProductDetailCard from "@/app/components/productDetailCard";

const ProductDetails = () => {
  const router = useRouter(); // Initialize router
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { id }: any = route.params;
  const [details, setDetails] = useState<any>({});
  const [load, setLoad] = useState<boolean>(true);
  const [ownership, setOwnership] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      async function getProductDetails() {
        const data = await axios.get(`${server}/api/listing/${id}`);
        console.log(data.data);
        if (data.data.success) {
          const productDetails = JSON.parse(
            JSON.stringify(data.data.productDetail)
          );
          console.log("ownership", data.data.isOwner);
          setLoad(false);
          setDetails(productDetails);
          setOwnership(data.data.isOwner);
        }
      }
      getProductDetails();
    }, [])
  );

  return !load ? (
    <ScrollView>
      <ProductDetailCard
        product={details}
        name={details?.owner?.username}
        isOwner={ownership}
      />
    </ScrollView>
  ) : null;
};

export default ProductDetails;

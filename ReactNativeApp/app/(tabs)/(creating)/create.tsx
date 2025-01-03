import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import RadioGroup from "react-native-radio-buttons-group";
import { launchImageLibrary } from "react-native-image-picker";
import { RadioButtonProps } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import server from "@/server";
import { useFocusEffect, useNavigation } from "expo-router";

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system"; // Expo's file system
import { Buffer } from "buffer"; // Ensure buffer is imported

const Create = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("");
  const [productType, setProductType] = useState("");
  const [negotiate, setNegotiate] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [file, setFile] = useState<any>("");

  const radioButtons: RadioButtonProps[] | any = useMemo(
    () => [
      {
        id: "1", // acts as primary key, should be unique and non-empty string
        label: "Yes",
        value: "true",
      },
      {
        id: "2",
        label: "No",
        value: "false",
      },
    ],
    []
  );

  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setDescription("");
      setPrice("");
      setPriceType("");
      setFile("");
      setImageUri("");
      setSelectedId("2");
      setNegotiate(false);
    }, [])
  );

  const generateDescription = async (imagePath: any) => {
    console.log("Ai generation called and the uri is ", imagePath);
    const genAI = new GoogleGenerativeAI(
      "AIzaSyBoE5l0fa9oT_Z6lq4L9UX70k1Dpo82NYw"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const prompt = `["Product Name (Indian Name)", "Product description about farming, benefits, nutritional information, and harvest, written in simple language for common people in India.", 500, "Kg"]`;
    const prompt =
      "Task : Analyze the uploaded image and return the following information of the uploaded image in the form of JSON object which can be parsed and used. The JSON object should consists of the following key : value pair as follows  {name: Product name along with a Indian name of the product in bracket (By identifying the image) , description : Product description  (Seller description of about 5-6 sentences, which describes about the farming details , key benefits /uses, nutritional/quality information, growing/harvest information.And also the description should be in a way that it is understandable to common people in India. ) , price : Current estimated Indian market price in INR interms of quantity.(Only price (string) without any text should be returned) , unit : The unit of quantity(for example: kg, g, ml , l ,dozen , crate) of the product (only the unit should be returned here) , productType : Type of agriculture product [fruits,vegetables or cereals] (only profuct type should be returned) } No other text should be there in the response other than the above given outputs in english";
    try {
      if (!imagePath || !imagePath.startsWith("file://")) {
        throw new Error("Invalid file path");
      }
      // // Read the selected image file as base64
      // const imageData = await FileSystem.readAsStringAsync(imageUri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      const fileInfo = await FileSystem.getInfoAsync(imagePath);

      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const base64Data = await FileSystem.readAsStringAsync(imagePath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const image = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg", // or 'image/jpeg' based on the image type
        },
      };

      // Send the image and prompt to the model to generate a description
      const result = await model.generateContent([prompt, image]);
      // console.log("text generated", result.response.text());
      const aiData = result.response.text();
      console.log("object", aiData);

      // const cleanAiData = aiData.replace(/\n|\r/g, "").trim(); // Remove new lines or unwanted characters
      const data1: any = aiData;

      const data = JSON.parse(data1);

      const price = String(data.price);

      // const priceNumber = String(arrayData[2]);
      setTitle(data.name);
      setDescription(data.description);
      setPrice(`${price}`);
      setPriceType(data.unit);
      setProductType(data.productType);
      return result.response.text();
    } catch (error) {
      console.error("Error generating description:", error);
      return null;
    }
  };

  // Request permission to access media library (iOS and Android)
  const pickImage = async () => {
    // // Ask for permission from gallery

    // const permissionResult =
    //   await ImagePicker.requestMediaLibraryPermissionsAsync();

    // if (permissionResult.granted === false) {
    //   alert("You've refused to allow this app to access your photos!");
    //   return;
    // }

    // // Open the image picker
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
    //   allowsEditing: true, // Allow user to crop the image
    //   aspect: [4, 3], // Aspect ratio for cropping
    //   quality: 1, // Image quality
    // });

    // if (!result.canceled) {
    //   setImageUri(result.assets[0].uri); // Save image URI to state
    // }

    //Takeusing camera

    //   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    //   if (permissionResult.granted === false) {
    //     alert("You've refused to allow this app to access your camera!");
    //     return;
    //   }
    // };

    // // Take a photo using the camera
    // const takePhoto = async () => {
    //   const result = await ImagePicker.launchCameraAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
    //     allowsEditing: true,  // Allow user to crop the image
    //     aspect: [4, 3], // Aspect ratio for cropping
    //     quality: 1, // Image quality
    //   });

    //   if (!result.canceled) {
    //     setImage(result.assets[0].uri);  // Save image URI to state
    //   }

    let result = await DocumentPicker.getDocumentAsync({
      type: "image/*", // Only allow images to be selected
      // copyToCacheDirectory: true, // Copies file to cache directory
    });

    if (!result.canceled) {
      console.log("image file upload");
      setImageUri(result?.assets[0]?.uri);
      setFile(result?.assets[0]); // Set the image URI to state
      const generatedDescription = await generateDescription(
        result?.assets[0]?.uri
      );
      if (generatedDescription) {
        console.log("AI generated Data", generateDescription);
      } else {
        console.log("AI generated Data error");
      }
    }
  };

  const handleRadioPress = (selectedId: string) => {
    setSelectedId(selectedId);
    selectedId == "1" ? setNegotiate(true) : setNegotiate(false);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      console.log("file", file);

      // Append form data
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("priceType", priceType);
      formData.append("productType", productType);
      formData.append("negotiate", JSON.stringify(negotiate));

      // Append the image file to the FormData object
      if (file) {
        const imageData = {
          uri: file.uri, // Make sure the URI is correctly formatted
          name: file.uri.split("/").pop(), // Extract the file name from the URI
          type: file.mimeType,
          size: file.size, // Set the MIME type; default to 'image/jpeg'
        };
        formData.append("image", imageData as any);
      }

      // Send the FormData object to the backend
      const response = await axios.post(`${server}/api/listing`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct Content-Type header
        },
        withCredentials: true, // Include credentials if necessary
        timeout: 10000, // Optional: Set a timeout for the request
      });

      if (response.data.success) {
        navigation.navigate("ProductDetails", { id: response.data.id });
      }
    } catch (err) {
      // Log the error if the request fails
      console.error("Upload error:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload With AI</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Price */}
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Price Type Dropdown */}
      <Text style={styles.label}>Price Type</Text>
      <RNPickerSelect
        onValueChange={(value) => setPriceType(value)}
        items={[
          { label: "Per Kg", value: "kg" },
          { label: "Per Piece", value: "piece" },
          { label: "Per Dozen", value: "dozen" },
          { label: "Per Gram", value: "g" },
          { label: "Per Crate", value: "crate" },
          { label: "Per ml", value: "ml" },
          { label: "Per l", value: "l" }, //dc
        ]}
        placeholder={{ label: "Select Price Type", value: null }}
        style={pickerSelectStyles}
        value={priceType}
      />

      {/* Product Type Dropdown */}
      <Text style={styles.label}>Product Type</Text>
      <RNPickerSelect
        onValueChange={(value) => setProductType(value)}
        items={[
          { label: "Fruit", value: "fruits" },
          { label: "Vegetable", value: "vegetables" },
          { label: "Cereals", value: "cereals" },
        ]}
        placeholder={{ label: "Select Product Type", value: null }}
        style={pickerSelectStyles}
        value={productType}
      />

      {/* Negotiable Radio Button */}
      <Text style={styles.label}>Negotiable</Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={handleRadioPress}
        selectedId={selectedId}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    height: 100,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 15,
  },
};

export default Create;

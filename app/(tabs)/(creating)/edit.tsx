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

const Edit = ({ route }: any) => {
  const { id } = route.params;
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
      async function getDetails() {
        const details = await axios.get(`${server}/api/listing/${id}`);
        console.log("edit details", details.data);
        if (details.data.success) {
          const pd = details.data.productDetail;
          setTitle(pd.title);
          setDescription(pd.description);
          setPrice(`${pd.price}`);
          setPriceType(`${pd.priceType}`);
          setProductType(`${pd.productType}`);
          setImageUri(pd.image);
          setFile("");
          setNegotiate(pd.negotiate);
          if (pd.negotiate) {
            setSelectedId("1");
          } else {
            setSelectedId("2");
          }
        }
      }
      getDetails();
    }, [])
  );

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
      setImageUri(result?.assets[0]?.uri);
      setFile(result?.assets[0]); // Set the image URI to state
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
      if (file !== "") {
        const imageData = {
          uri: file.uri, // Make sure the URI is correctly formatted
          name: file.uri.split("/").pop(), // Extract the file name from the URI
          type: file.mimeType,
          size: file.size, // Set the MIME type; default to 'image/jpeg'
        };
        formData.append("image", imageData as any);
      } else {
        formData.append("image", imageUri);
      }

      // Send the FormData object to the backend
      const response = await axios.put(
        `${server}/api/listing/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct Content-Type header
          },
          withCredentials: true, // Include credentials if necessary
          timeout: 10000, // Optional: Set a timeout for the request
        }
      );

      // Log the response data
      console.log("dataUploaded");
      console.log("dataFromA", response.data);
      if (response.data.success) {
        navigation.navigate("ProductDetails", { id: id });
      }
    } catch (err) {
      // Log the error if the request fails
      console.error("Upload error:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
        value={priceType}
        placeholder={{ label: "Select Price Type", value: null }}
        style={pickerSelectStyles}
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
        value={productType}
        placeholder={{ label: "Select Product Type", value: null }}
        style={pickerSelectStyles}
      />

      {/* Negotiable Radio Button */}
      <Text style={styles.label}>Negotiable</Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={handleRadioPress}
        selectedId={selectedId}
      />

      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

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

export default Edit;

import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { Link } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import server from "@/server";
import axios from "axios";

const index = () => {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function checkLogin() {
        const data = await axios.get(`${server}/api/user/checkLogin`);
        if (data.data.success && data.data.message === "loggedIn") {
          Alert.alert("Already Logged In", "", [
            { text: "OK", onPress: () => navigateToProducts() },
          ]);
        }
      }
      checkLogin();
    }, [])
  );

  const handleLogin = async () => {
    const data = await axios.post(
      `${server}/api/user/login`,
      { username, password },
      { withCredentials: true }
    );
    console.log(data.data);
    if (data.data.success && data.data.message === "successLogin") {
      Alert.alert("Login Successful", `Welcome!`, [
        {
          text: "OK",
          onPress: () => navigateToProducts(), // Navigate to the 'Home' screen
        },
      ]);
    } else {
      Alert.alert(
        "Login Failed",
        "Please enter both username and password correctly",
        [{ text: "OK" }]
      );
    }
  };

  const navigateToProducts = () => {
    router.push("/products"); // Navigate to the index.tsx (root of app)
  };
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: "https://example.com/logo.png" }}
        style={styles.logo}
      />

      {/* Username Input */}
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Signup Link */}
      <View style={styles.signupContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default index;

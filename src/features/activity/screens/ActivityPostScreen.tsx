// src/features/activity/screens/ActivityPostScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ActivityPostScreen: React.FC = () => {
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic text validation: non-empty, length limit
  const isValid = text.trim().length > 0 && text.trim().length <= 280;

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert("Validation Error", "Please enter valid text (1-280 characters).");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not Logged In", "You must be logged in to post an activity.");
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would fetch user profile info from DB or user context
      const userProfile = {
        id: user.uid,
        name: user.displayName || "Anonymous",
        avatarUrl: user.photoURL || "https://placehold.co/100x100", // fallback avatar
      };

      await addDoc(collection(db, "activities"), {
        text: text.trim(),
        userProfile,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      setText("");
      Alert.alert("Success", "Activity posted.");
      navigation.goBack();
    } catch (error) {
      console.error("Error posting activity:", error);
      Alert.alert("Error", "Failed to post activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Post an Activity</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What would you like to share?"
        multiline
        numberOfLines={4}
        editable={!loading}
        style={{
          borderColor: isValid ? "#ccc" : "red",
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          textAlignVertical: "top",
          marginBottom: 10,
        }}
        accessibilityLabel="Activity text input"
        testID="activity-post-text-input"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!isValid || loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isValid || loading }}
        style={{
          backgroundColor: !isValid || loading ? "#ccc" : "#007AFF",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
        testID="activity-post-button"
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>{loading ? "Posting..." : "Post"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ActivityPostScreen;
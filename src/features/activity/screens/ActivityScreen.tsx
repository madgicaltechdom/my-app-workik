import { Alert } from "react-native";
import { deleteActivity, toggleLikeActivity, postCommentToActivity } from "@/services/activityService";
// src/features/activity/screens/ActivityScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { collection, query, orderBy, onSnapshot, getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ActivityItem from "@/components/ActivityItem";
import { useUser } from "@/contexts/UserContext";

interface Activity {
  id: string;
  text: string;
  userProfile: { id: string; name: string; avatarUrl: string };
  likes: string[]; // list of user ids who liked
  comments: Comment[];
  createdAt: any;
}

interface Comment {
  id: string;
  userProfile: { id: string; name: string; avatarUrl: string };
  text: string;
  createdAt: any;
}

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const ActivityScreen: React.FC = () => {
  const { user } = useUser();
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

  // Delete activity handler (must be after db is defined)
  const handleDelete = useCallback(
    (activityId: string) => {
      Alert.alert(
        "Delete Activity",
        "Are you sure you want to delete this activity? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteActivity(activityId);
              } catch (error) {
                Alert.alert("Error", "Failed to delete activity.");
              }
            },
          },
        ]
      );
    },
    []
  );
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({}); // Track expanded comment sections by activity id

  // Fetch activities in realtime, ordered by createdAt desc
  useEffect(() => {
    const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedActivities: Activity[] = [];
      snapshot.forEach((docSnap) => {
        fetchedActivities.push({ id: docSnap.id, ...(docSnap.data() as Omit<Activity, "id">) });
      });
      setActivities(fetchedActivities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  // Toggle comment section expand/collapse
  const toggleComments = useCallback((activityId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  }, []);


  // Handle like button press
  const handleLike = useCallback(
    async (activityId: string) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const activity = activities.find((act) => act.id === activityId);
      if (!activity) return;
      const alreadyLiked = activity.likes.includes(userId);
      try {
        await toggleLikeActivity(activityId, userId, alreadyLiked);
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },
    [activities, auth.currentUser?.uid]
  );

  // Handle add comment
  const handleAddComment = useCallback(
    async (activityId: string, commentText: string) => {
      if (!user) return;
      try {
        await postCommentToActivity(activityId, commentText, {
          id: user.uid,
          name: user.displayName || "Anonymous",
          avatarUrl: user.photoURL || "",
        });
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    },
    [user]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ActivityItem
            activity={item}
            isCommentsExpanded={!!expandedComments[item.id]}
            onToggleComments={() => toggleComments(item.id)}
            onLike={() => handleLike(item.id)}
            onDelete={item.userProfile.id === user?.uid ? () => handleDelete(item.id) : undefined}
            currentUserId={user?.uid}
            onAddComment={(commentText: string) => handleAddComment(item.id, commentText)}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No activities found.</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ActivityPostScreen")}
        accessibilityLabel="Add Activity Post"
        testID="add-activity-fab"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ActivityScreen;
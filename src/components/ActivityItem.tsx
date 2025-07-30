// src/features/activity/components/ActivityItem.tsx
import React, {useState} from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";

interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
}

interface Comment {
  id: string;
  userProfile: UserProfile;
  text: string;
  createdAt: any;
}

interface Activity {
  id: string;
  text: string;
  userProfile: UserProfile;
  likes: string[];
  comments: Comment[];
  createdAt: any;
}

interface Props {
  activity: Activity;
  isCommentsExpanded: boolean;
  onToggleComments: () => void;
  onLike: () => void;
  onDelete?: (() => void) | undefined;
  currentUserId?: string | undefined;
  onAddComment?: (commentText: string) => void;
}

const ActivityItem: React.FC<Props> = ({ activity, isCommentsExpanded, onToggleComments, onLike, onDelete, currentUserId, onAddComment }) => {
  const [commentInput, setCommentInput] = useState("");
  const isOwner = typeof currentUserId === 'string' && activity.userProfile.id === currentUserId;
  // console.log('[ActivityItem] Is Owner', isOwner)
  return (
    <View
      style={{
        marginBottom: 20,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
      accessible
      accessibilityLabel={`${activity.userProfile.name} activity`}
    >
      {/* User Info */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Image
          source={{ uri: activity.userProfile.avatarUrl }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
          accessibilityLabel={`${activity.userProfile.name} avatar`}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#222" }}>
            {activity.userProfile.name}
          </Text>
          <Text style={{ color: "#666", fontSize: 12 }}>
            {activity.createdAt && typeof activity.createdAt.toDate === 'function'
              ? formatDistanceToNow(activity.createdAt.toDate(), { addSuffix: true })
              : 'just now'}
          </Text>
        </View>
      </View>

      {/* Activity Text */}
      <Text style={{ fontSize: 14, marginBottom: 12 }}>{activity.text}</Text>

      {/* Actions: Like, Comments, Delete */}
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <TouchableOpacity
          onPress={onLike}
          accessibilityRole="button"
          accessibilityLabel={`Like button, ${activity.likes.length} likes`}
          style={{ flexDirection: "row", alignItems: "center", marginRight: 24 }}
          testID="like-activity-button"
        >
          <Text style={{ fontSize: 18, color: "#666", marginRight: 6 }}>♡</Text>
          <Text>{activity.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleComments}
          accessibilityRole="button"
          accessibilityLabel={`Comments button, ${activity.comments.length} comments`}
          style={{ flexDirection: "row", alignItems: "center", marginRight: isOwner ? 24 : 0 }}
          testID="comments-activity-button"
        >
          <Text style={{ fontSize: 18, color: "#666", marginRight: 6 }}>💬</Text>
          <Text>{activity.comments.length}</Text>
        </TouchableOpacity>

        {isOwner && onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete activity"
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 8,
              padding: 8,
              borderRadius: 16,
              backgroundColor: "#fff",
              // Add shadow for iOS and elevation for Android for visibility
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="delete-comment-activity-button"
          >
            <Text style={{ fontSize: 22, color: "#d00" }}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Collapsible Comment Section */}
      {isCommentsExpanded && (
        <View style={{ marginTop: 12 }} testID="comments-section">
          {activity.comments.length === 0 && <Text style={{ fontSize: 13, color: "#888" }}>No comments yet</Text>}
          {activity.comments.map((comment) => (
            <View key={comment.id} style={{ flexDirection: "row", marginBottom: 8 }}>
              <Image
                source={{ uri: comment.userProfile.avatarUrl }}
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>{comment.userProfile.name}</Text>
                <Text style={{ fontSize: 13, color: "#444" }}>{comment.text}</Text>
              </View>
            </View>
          ))}
          {/* Add Comment Input */}
          {onAddComment && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <TextInput
                value={commentInput}
                onChangeText={setCommentInput}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  fontSize: 14,
                  color: '#222',
                }}
                placeholderTextColor="#888"
                accessibilityLabel="Add a comment input"
                returnKeyType="send"
                onSubmitEditing={() => {
                  if (commentInput.trim()) {
                    onAddComment && onAddComment(commentInput.trim());
                    setCommentInput("");
                  }
                }}
                testID="add-comment-activtiy-input"
              />
              <TouchableOpacity
                onPress={() => {
                  if (commentInput.trim()) {
                    onAddComment(commentInput.trim());
                    setCommentInput("");
                  }
                }}
                style={{ marginLeft: 8, padding: 6, backgroundColor: '#007AFF', borderRadius: 16 }}
                accessibilityLabel="Post comment"
                testID="post-comment-activtiy-input"
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ActivityItem;
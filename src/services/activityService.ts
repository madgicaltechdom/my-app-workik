
/**
 * Post a comment to an activity in Firestore
 * @param activityId Activity document id
 * @param commentText The comment text
 * @param userProfile The user profile object { id, name, avatarUrl }
 */
export async function postCommentToActivity(
  activityId: string,
  commentText: string,
  userProfile: { id: string; name: string; avatarUrl: string }
): Promise<void> {
  // Use a timestamp-based unique id for React Native compatibility
  const commentId = `comment_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const comment = {
    id: commentId,
    userProfile,
    text: commentText,
    createdAt: new Date(),
  };
  const activityRef = doc(db, "activities", activityId);
  console.log('[activityService] Attempting to post comment:', commentId, 'to activity:', activityId);
  try {
    await updateDoc(activityRef, {
      comments: arrayUnion(comment),
    });
    console.log('[activityService] Successfully posted comment:', commentId, 'to activity:', activityId);
  } catch (error) {
    console.error('[activityService] Error posting comment:', commentId, 'to activity:', activityId, error);
    throw error;
  }
}
/**
 * Like or unlike an activity in Firestore
 * @param activityId Activity document id
 * @param userId Current user id
 * @param alreadyLiked Whether the user already liked the activity
 */
import { arrayUnion, updateDoc, doc, arrayRemove, deleteDoc } from "firebase/firestore";
// import { db } from "./firebaseConfig";

// Type declaration for db if imported from JS file
declare const db: import("firebase/firestore").Firestore;

export async function toggleLikeActivity(activityId: string, userId: string, alreadyLiked: boolean): Promise<void> {
  const activityRef = doc(db, "activities", activityId);
  if (alreadyLiked) {
    // Unlike
    await updateDoc(activityRef, {
      likes: arrayRemove(userId),
    });
    console.log('[activityService] Unliked activity:', activityId, userId);
  } else {
    // Like
    await updateDoc(activityRef, {
      likes: arrayUnion(userId),
    });
    console.log('[activityService] Liked activity:', activityId, userId);
  }
}


/**
 * Delete an activity by id from Firestore
 * @param activityId Activity document id
 */
export async function deleteActivity(activityId: string): Promise<void> {
  console.log('[activityService] Attempting to delete activity:', activityId);
  try {
    await deleteDoc(doc(db, "activities", activityId));
    console.log('[activityService] Successfully deleted activity:', activityId);
  } catch (error) {
    console.error('[activityService] Error deleting activity:', activityId, error);
    throw error;
  }
}

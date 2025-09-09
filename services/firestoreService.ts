import { db } from '../firebaseConfig';
import { UserProfile } from '../types';

export const saveUserProfile = async (userId: string, profileData: UserProfile): Promise<void> => {
  try {
    // Fix: Use compat API for document reference and setting data.
    const userDocRef = db.collection("users").doc(userId);
    await userDocRef.set(profileData, { merge: true });
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error("Could not save your profile information.");
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Fix: Use compat API for document reference and getting data.
    const userDocRef = db.collection("users").doc(userId);
    const docSnap = await userDocRef.get();
    // Fix: Use `docSnap.exists` property instead of `exists()` method for compat API.
    if (docSnap.exists) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Could not retrieve your profile information.");
  }
};
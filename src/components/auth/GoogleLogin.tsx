import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";

const GoogleLogin = () => {
  const [, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const GoogleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, GoogleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // If user document doesn't exist, create a new one
        await setDoc(userDocRef, {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          profileMessage: "", // Initialize empty profile message
          isCouple: false, // Initial couple status
          partnerId: null, // No partner by default
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error logging in with Google: ", error);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <button onClick={handleGoogleLogin}>
      <img
        src="/login/google.svg"
        className="w-full transition duration-300 ease-in-out transform hover:brightness-90"
      />
    </button>
  );
};

export default GoogleLogin;

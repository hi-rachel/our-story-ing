import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useRouter } from "next/router";

const GoogleLogin = () => {
  const [, setLoading] = useState(false);
  const [, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      console.log(e);
    } finally {
      setLoading(false);
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

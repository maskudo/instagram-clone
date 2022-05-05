import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Login() {
  const [username, setUsername] = useState("");
  const [isEmailTaken, setisEmailTaken] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isNoAccountExists, setIsNoAccountExists] = useState(false);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const colRef = collection(db, "users");
    const q = query(colRef, where("uid", "==", `${user.uid}`));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setIsNoAccountExists(true);
      signOut(auth);
    }
  };
  const signUp = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", username.toLowerCase());

    const userDoc = await getDoc(docRef);
    if (!!userDoc.data()) {
      setIsUsernameTaken(true);
      return;
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const colRef = collection(db, "users");
    const q = query(colRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setisEmailTaken(true);
      return;
    }
    setDoc(docRef, {
      displayName: user.displayName,
      photo: user.photoURL,
      uid: user.uid,
      email: user.email,
      posts: [],
    });
  };
  return (
    <div className="login">
      <button className="btn btn-primary" onClick={googleLogin}>
        Login with Google
      </button>
      <form onSubmit={signUp} className="form">
        <input
          name="username"
          id="username"
          type="text"
          className="form-control"
          placeholder="Enter username"
          required
          pattern="[a-zA-Z][a-zA-Z0-9_]{3,20}"
          onChange={(e) => {
            setUsername(e.target.value);
            setIsUsernameTaken(false);
            setisEmailTaken(false);
            setIsNoAccountExists(false);
          }}
        />
        <input
          className="btn btn-success btn-lg"
          type="submit"
          value={"Sign Up with Google"}
        />
        <p className="text-danger">{isEmailTaken && "Email already taken"}</p>
        <p className="text-danger">
          {isUsernameTaken && "Username already taken"}
        </p>
        <p className="text-danger">
          {isNoAccountExists && "account not registered"}
        </p>
      </form>
    </div>
  );
}

export default Login;

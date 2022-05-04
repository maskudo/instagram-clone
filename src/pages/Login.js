import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { authentication, db } from "../firebase";
import { addDoc, collection, setDoc, doc, getDoc } from "firebase/firestore";
function Login() {
  const [username, setUsername] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        return user;
        // if created=lastsignedin init user to database  and set context
        // else  get user data ffrom database
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
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
    const result = await signInWithPopup(authentication, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    if (!(user.metadata.createdAt === user.metadata.lastLoginAt)) {
      setIsEmailError(true);
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
            setIsEmailError(false);
          }}
        />
        <input
          className="btn btn-success btn-lg"
          type="submit"
          value={"Sign Up with Google"}
        />
        <p className="text-danger">{isEmailError && "Email already taken"}</p>
        <p className="text-danger">
          {isUsernameTaken && "Username already taken"}
        </p>
      </form>
    </div>
  );
}

export default Login;

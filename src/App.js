import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { UserContextProvider, UserContext } from "./context/UserContext";
import { auth, db } from "./firebase";
import "./styles/App.css";

function App() {
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    const unSubAuth = onAuthStateChanged(auth, (loggedUser) => {
      const getData = async () => {
        const colRef = collection(db, "users");
        const q = query(colRef, where("uid", "==", `${loggedUser.uid}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser({ ...doc.data(), username: doc.id });
        });
      };
      getData();
    });
    return unSubAuth();
  }, [setUser]);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function AppWrapper() {
  return (
    <UserContextProvider>
      <App />
    </UserContextProvider>
  );
}

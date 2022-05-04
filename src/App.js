import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { UserContextProvider, UserContext } from "./context/UserContext";
import { auth } from "./firebase";
import "./styles/App.css";

function App() {
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    const unSubAuth = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);
      console.log(loggedUser);
    });
    return unSubAuth();
  }, []);
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

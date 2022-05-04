import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { UserContextProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;

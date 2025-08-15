import "./app.scss";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Watch from "./pages/watch/Watch";
import Login from "./pages/login/Login";
import Movies from "./pages/movies/Movies";
import Series from "./pages/series/Series";
import Profile from "./pages/profile/Profile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext.jsx";

const App = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Home /> : <Navigate to="/register" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" replace />} 
        />
        {user && (
          <>
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/watch/:id" element={<Watch />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
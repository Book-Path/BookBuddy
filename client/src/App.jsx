import { useState, useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AchievementsPage from "./pages/AchievementsPage";
import AddBookPage from "./pages/AddBookPage";
import ManageBooksPage from "./pages/ManageBooksPage";

const API_URL = "https://server-uwgo.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, {
        credentials: "include",
      });
      const json = await response.json();
      setUser(json.user);
    };
    getUser();
  }, []);

  const logout = async () => {
    const url = `${API_URL}/auth/logout`;
    await fetch(url, { credentials: "include" })
    // const response = await fetch(url, { credentials: 'include' });
    // const json = await response.json();
    window.location.href = "/";
  };

  const element = useRoutes([
    {
      path: "/",
      element: user && user.id ? (<HomePage user={user} api_url={API_URL} onLogout={logout} />) : (<LoginPage api_url={API_URL} />),
    },
    {
      path: "/achievements",
      element: user && user.id ? (<AchievementsPage user={user} api_url={API_URL} onLogout={logout} />) : (<LoginPage api_url={API_URL} />),
    },
    {
      path: "/books/new",
      element: user && user.id ? <AddBookPage api_url={API_URL} onLogout={logout} /> : <LoginPage api_url={API_URL} />,
    },
    {
      path: "/books/manage",
      element: user && user.id ? <ManageBooksPage /> : <LoginPage api_url={API_URL} />,
    },
  ]);

  return (
    <div className="App">
      {element}
    </div>
  );
}

export default App;
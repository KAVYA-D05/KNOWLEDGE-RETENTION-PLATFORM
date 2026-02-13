import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GoogleSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const userName = params.get("name");
    const userEmail = params.get("email");

    if (userName && userEmail) {
      localStorage.clear();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", userName);
      localStorage.setItem("email", userEmail);

      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <h3>Signing you in...</h3>;
}

export default GoogleSuccess;

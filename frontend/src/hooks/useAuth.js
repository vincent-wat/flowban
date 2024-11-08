import { useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);
};

export default useAuth;
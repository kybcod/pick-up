import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export function OAuthRedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      axios
        .get(`/oauth/login?code=${code}&state=${state}`)
        .then(() => {
          navigate("/signup");
        })
        .catch((error) => {
          console.error("Error during token retrieval", error);
        });
    }
  }, [location, history]);

  return <div>Redirecting...</div>;
}

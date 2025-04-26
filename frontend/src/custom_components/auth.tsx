import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthScreen = () => {
  const [content, setContent] = useState<string | null>("Authorizing User...");
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .post(import.meta.env.VITE_API_BASE_URL + "/auth/login", {})
      .then((val) => {
        navigate("/inbox");
      })
      .catch((error) => {
        setContent("Authorization Failed ");
        setError(error);
      });
  }, []);

  return (
    <>
      <div>{content}</div>
      <div>{error}</div>
    </>
  );
};

export default AuthScreen;

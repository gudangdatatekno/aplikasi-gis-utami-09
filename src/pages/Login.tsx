
import { LoginForm } from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // Store login state in localStorage for demo purposes
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    
    // Navigate to dashboard
    navigate("/");
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default Login;

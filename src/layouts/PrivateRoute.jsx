import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function PrivateRoute({ children }) {
  const { usuario } = useAuthStore();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

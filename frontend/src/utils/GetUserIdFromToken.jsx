import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

const getUserIdFromToken = () => {
  const token = Cookies.get("auth_token")
  console.log("Token from cookies:", token)
  if (!token) {
    console.error("Token not found in cookies")
    return null;
  }

  try {
    const decodedToken = jwtDecode(token)
    return decodedToken.userId
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
};

export default getUserIdFromToken;
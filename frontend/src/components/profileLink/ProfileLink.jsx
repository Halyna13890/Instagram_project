import React from "react"
import { Link } from "react-router-dom"
import getUserIdFromToken from "../../utils/GetUserIdFromToken"

const ProfileLink = () => {
  const userId = getUserIdFromToken()
  console.log("User ID from token:", userId)
  if (!userId) {
    return <p>User not authenticated</p>;
  }

  return (
    <Link to={`/profile/${userId}`}>Profile</Link>
  );
};

export default ProfileLink;
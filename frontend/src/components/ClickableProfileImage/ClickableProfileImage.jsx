import React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultPhoto from "../../accets/icons8-user-default-64.png";

const ClickableProfileImage = ({ image, userId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`); 
    } else {
      console.error("User ID is undefined");
    }
  };

  return (
    <img
      src={image || defaultPhoto }
      alt="Profile"
      className="profile-image"
      onClick={handleClick}
      style={{ cursor: 'pointer' }} 
    />
  );
};

export default ClickableProfileImage;
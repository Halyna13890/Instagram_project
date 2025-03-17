import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowing, checkFollowingForUsers } from "../../redux/slieces/followerSlice";

const FollowButton = ({ userId }) => {
  const dispatch = useDispatch();
  const isFollowing = useSelector((state) => state.follow.following[userId]); 

  
  useEffect(() => {
    if (userId) {
      dispatch(checkFollowingForUsers([userId])); 
    }
  }, [userId, dispatch]);

 
  const handleFollowToggle = () => {
    if (userId) {
      dispatch(toggleFollowing(userId)); 
    }
  };

  return (
    <button onClick={handleFollowToggle}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
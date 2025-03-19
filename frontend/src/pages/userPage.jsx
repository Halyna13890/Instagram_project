import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../redux/slieces/authSlice";
import { fetchUserPosts } from "../redux/slieces/postSlice";
import defaultPhoto from "../accets/icons8-user-default-64.png";
import FollowButton from "../components/followButton/followButton";

const getUserIdFromToken = () => {
  const cookie = document.cookie.split("; ").find(row => row.startsWith("auth_token="));
  if (!cookie) {
    console.error("Кука auth_token не найдена");
    return null;
  }

  try {
    const token = cookie.split("=")[1];
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (error) {
    console.error("Ошибка при разборе токена:", error);
    return null;
  }
};

const UserPage = () => {
  const { userId } = useParams();
  console.log("User ID from URL:", userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();

  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const { user, loading: userLoading, error: userError } = useSelector(state => state.auth || {});
  const { posts, loading: postsLoading, error: postsError } = useSelector(state => state.posts || {});

  useEffect(() => {
    console.log("userId из URL:", userId);
    console.log("userId из токена:", currentUserId);
  }, [userId, currentUserId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (userId) {
        try {
          console.log("Fetching user profile for ID:", userId);
          const userProfileResponse = await dispatch(fetchUserProfile(userId));
          console.log("User profile data:", userProfileResponse);
          if (userProfileResponse?.payload) {
            setProfileData(userProfileResponse.payload);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    const fetchPostsData = async () => {
      if (userId) {
        try {
          const postsResponse = await dispatch(fetchUserPosts(userId));
          console.log("User posts data:", postsResponse);
          if (postsResponse?.payload) {
            setUserPosts(postsResponse.payload);
          }
        } catch (error) {
          console.error("Error fetching posts data:", error);
        }
      }
    };

    fetchProfileData();
    fetchPostsData();
  }, [dispatch, userId]);

  const handleViewPostDetails = postId => {
    if (postId) {
      navigate(`/post/${postId}`);
    } else {
      console.error("Post ID is undefined");
    }
  };


  const handleEditProfile = () => {
    navigate(`/profile/${userId}/edit`);
  };

  if (userError) {
    console.error("Error fetching user profile:", userError);
  }

  if (postsError) {
    console.error("Error fetching user posts:", postsError);
  }

  return (
    <div className="profile-page">
      {userLoading ? (
        <p>Loading profile...</p>
      ) : user ? (
        <div className="profile-info">
          <img src={user.image || defaultPhoto} alt={`${user.username}'s avatar`} className="profile-avatar" />
          <h2>{user.username}</h2>
          <p>{user.about}</p>
          <a href={user.website} target="_blank" rel="noopener noreferrer">
            {user.website}
          </a>
          <div className="follow-info">
            <span>{user.follower} Following</span>
            <span>{user.following} Followers</span>
          </div>

          {currentUserId === userId ? (
            <button className="edit-profile-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          ) : (
            <FollowButton userId={userId} />
          )}
        </div>
      ) : (
        <p>User not found</p>
      )}

      <div className="user-posts">
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : userPosts.length > 0 ? (
          userPosts.map(post => (
            <div className="post" key={post._id} onClick={() => handleViewPostDetails(post._id)}>
              <img src={post.image} alt="Post" className="post-image" />
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
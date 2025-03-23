import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../redux/slieces/authSlice";
import { fetchUserPosts } from "../../redux/slieces/postSlice";
import { logoutUser } from "../../redux/slieces/authSlice";
import defaultPhoto from "../../accets/icons8-user-default-64.png";
import FollowButton from "../../components/followButton/followButton";
import "./userPage.css";

const getUserIdFromToken = () => {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith("auth_token="));
  if (!cookie) {
    return null;
  }

  try {
    const token = cookie.split("=")[1];
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (error) {
    return null;
  }
};

const formatWebsiteUrl = (url) => {
  if (!url) return ""; 

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`; 
  }

  return url; 
};

const UserPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();

  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const { user, loading: userLoading, error: userError } = useSelector((state) => state.auth || {});
  const { posts, loading: postsLoading, error: postsError } = useSelector((state) => state.posts || {});

  useEffect(() => {
    const fetchProfileData = async () => {
      if (userId) {
        try {
          const userProfileResponse = await dispatch(fetchUserProfile(userId));
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

  const handleViewPostDetails = (postId) => {
    if (postId) {
      navigate(`/post/${postId}`);
    } else {
      console.error("Post ID is undefined");
    }
  };

  const handleEditProfile = () => {
    navigate(`/profile/${userId}/edit`);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login"); 
    });
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
        <>
          <div className="profile-info">
            <img
              src={user.image || defaultPhoto}
              alt={`${user.username}'s avatar`}
              className="profile-avatar"
            />
            <div className="info-section">
              <div className="username-edit">
                <h3>{user.username}</h3>
                {currentUserId === userId ? (
                  <>
                    <button className="edit-profile-btn" onClick={handleEditProfile}>
                      Edit Profile
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <FollowButton userId={userId} className="profile-follow-btn"/>
                )}
              </div>
              <div className="follow-info">
                <span>Following {user.following}</span>
                <span>Followers {user.followers}</span>
              </div>
              <p>{user.about}</p>
              <a
                href={formatWebsiteUrl(user.website)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
              </a>
            </div>
          </div>

          <div className="user-posts">
            {postsLoading ? (
              <p>Loading posts...</p>
            ) : userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  className="post"
                  key={post._id}
                  onClick={() => handleViewPostDetails(post._id)}
                >
                  <img src={post.image} alt="Post" className="post-image" />
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserPage;
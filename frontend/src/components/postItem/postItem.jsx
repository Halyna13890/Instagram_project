import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkFollowingForUsers, toggleFollowing } from "../../redux/slieces/followerSlice";
import { checkLikesForPosts, toggleLike } from "../../redux/slieces/likeSlise";
import { useNavigate } from "react-router-dom";
import defaultPhoto from "../../accets/icons8-user-default-64.png";

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount);

  const { following } = useSelector((state) => state.follow);
  const { likes } = useSelector((state) => state.likes);

  const isFollowing = post.user ? following[post.user._id] || false : false;
  const isLiked = post._id && likes[post._id] ? likes[post._id].isLike : false;

  useEffect(() => {
    if (post.user) {
      dispatch(checkFollowingForUsers([post.user._id]));
    }
    dispatch(checkLikesForPosts([post._id]));
  }, [dispatch, post.user?._id, post._id]);

  const handleToggleFollow = () => {
    if (post.user) {
      dispatch(toggleFollowing(post.user._id));
    }
  };

  const handleToggleLike = () => {
    dispatch(toggleLike(post._id))
      .unwrap()
      .then((response) => {
        const { message, post, isLike } = response;
        setLocalLikesCount(post.likesCount);
      })
      .catch((error) => {
        console.error("Error toggling like:", error);
      });
  };

  const handleViewPostDetails = () => {
    if (post._id) {
      navigate(`/post/${post._id}`);
    } else {
      console.error("Post ID is undefined");
    }
  };

  return (
    <div className="post-item">
      <div className="post-header">
        {post.user && (
          <>
            <div className="user-info">
              <img
                src={post.user.image || defaultPhoto}
                alt="User"
                className="user-image"
              />
              <p className="user-name">{post.user.username}</p>
            </div>
            <div className="follow-button">
              <button onClick={handleToggleFollow}>
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </>
        )}
      </div>

      <img
        src={post.image}
        alt="Post"
        className="post-image"
        onClick={handleViewPostDetails}
        style={{ cursor: "pointer" }}
      />

      <div className="post-actions">
        <button onClick={handleToggleLike}>
          {isLiked ? "❤️" : "🤍"}
        </button>
        <button onClick={handleViewPostDetails}>💬</button>
      </div>

      <p className="likes-count">{localLikesCount} likes</p>

      <div className="post-text">
        {post.user && (
          <>
            <p>{post.user.username}</p>
            <p>
              {expanded ? post.text : `${post.text.slice(0, 100)}...`}
              {!expanded && post.text.length > 100 && (
                <button onClick={() => setExpanded(true)}>more</button>
              )}
            </p>
          </>
        )}
      </div>

      <button onClick={handleViewPostDetails}>View all comments</button>
    </div>
  );
};

export default PostItem;

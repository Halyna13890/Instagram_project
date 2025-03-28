import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkLikesForPosts, toggleLike } from "../../redux/slieces/likeSlise";
import { useNavigate } from "react-router-dom";
import defaultPhoto from "../../accets/icons8-user-default-64.png";
import FollowButton from "../followButton/followButton";
import ClickableProfileImage from "../ClickableProfileImage/ClickableProfileImage"; 
import "./postItem.css"
import heart from "../../accets/heart.svg"
import redHeart from "../../accets/red_heart.png"
import comment from "../../accets/Comment.svg"

const PostItem = ({ post }) => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount || 0);

  const { likes } = useSelector((state) => state.likes);
  const isLiked = post._id && likes[post._id] ? likes[post._id].isLike : false;

  useEffect(() => {
    dispatch(checkLikesForPosts([post._id]));
  }, [dispatch, post._id]);

  const handleToggleLike = () => {
    dispatch(toggleLike(post._id))
      .unwrap()
      .then((response) => {
        const { likesCount } = response;
        setLocalLikesCount(likesCount);
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

  const MAX_LENGTH = 10;

  return (
    <div className="post-item">
      <div className="post-header">
        {post.user && (
          <>
            <div className="user-info">
              <ClickableProfileImage
                image={post.user.image || defaultPhoto}
                userId={post.user._id} 
                className="profile-image"
              />
              <p className="user-name">{post.user.username}</p>
            </div>
            <div className="follow-button">
              <FollowButton userId={post.user?._id} className="custom-follow-button"/>
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
        <button className="like" onClick={handleToggleLike}>
          {isLiked ? (
            <img className="heart" src={redHeart} alt="Liked" />
          ) : (
            <img className="heart" src={heart} alt="Not Liked" />
          )}
        </button>
        <button className="comment-botton" onClick={handleViewPostDetails}>
          <img src={comment} className="comment-svg"/>
        </button>
      </div>

      <p className="likes-count">{localLikesCount} likes</p>

      <div className="post-text">
        {post.user && (
          <>
            <p className="user-name">{post.user.username}</p>
            <p>
              {expanded || post.text.length <= MAX_LENGTH ? (
                post.text
              ) : (
                <>
                  {post.text.slice(0, MAX_LENGTH)}
                  <span
                    onClick={() => setExpanded(true)}
                    className="more"
                  >
                    ...more
                  </span>
                </>
              )}
            </p>
          </>
        )}
      </div>

      <button className="View-comments" onClick={handleViewPostDetails}>
        View all comments
      </button>
      <div className="line"></div>
    </div>
  );
};

export default PostItem;
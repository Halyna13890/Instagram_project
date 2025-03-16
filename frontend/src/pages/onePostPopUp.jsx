import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOnePost } from "../redux/slieces/postSlice";
import { fetchComments } from "../redux/slieces/commentSlice";
import { useParams } from "react-router-dom";
import { toggleFollowing } from "../redux/slieces/followerSlice";
import defaultPhoto from "../accets/icons8-user-default-64.png";
import api from "../api/interceptor";

const API_URL = import.meta.env.VITE_API_URL;

const PostModal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singlePost, loading, error } = useSelector((state) => state.allPosts);
  const { comments, loadingComments, errorComments } = useSelector((state) => state.comments);

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchOnePost(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    console.log("Comments from Redux:", comments);
  }, [comments]);

  const handleCreateComment = async () => {
    if (!id) {
      console.error("Post ID is missing");
      return;
    }
  
    if (commentText.trim()) {
      try {
        const response = await api.post(`${API_URL}/comment/create/${id}`, {
          message: commentText,
        });
  
        if (response.data.comment) {
          setCommentText("");
          dispatch(fetchComments(id));
        }
      } catch (error) {
        console.error("Ошибка при создании комментария", error);
      }
    }
  };
  const handleFollowToggle = () => {
    if (singlePost?.user?._id) {
      dispatch(toggleFollowing(singlePost.user._id));
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="post-modal">
      <div>
        {singlePost?.image && <img src={singlePost.image} alt="Post" />}
      </div>
      <div>
        <div>
          <img src={singlePost?.user?.image || defaultPhoto} alt={singlePost?.user?.username || "User"} />
          <p>{singlePost?.user?.username || "Unknown User"}</p>
          <button onClick={handleFollowToggle}>
            {singlePost?.user?.isFollowed ? "Unfollow" : "Follow"}
          </button>
        </div>
        <div>
          <div>
            <img src={singlePost?.user?.image || defaultPhoto} alt={singlePost?.user?.username || "User"} />
          </div>
          <div>
            <p>{singlePost?.user?.username || "Unknown User"}</p>
            <p>{singlePost?.text || "No text available."}</p>
          </div>
          <div className="comments-section">
                {loadingComments && <p>Loading comments...</p>}
                    {errorComments && <p>{errorComments}</p>}
                        {comments?.length > 0 ? (
                        comments.map((comment) => (
                        <div key={comment._id} className="comment">
                        <div className="comment-user-info">
                         <img src={comment?.user?.image || defaultPhoto} alt={comment?.user?.username || "User"} />
                    <p>{comment?.user?.username || "Unknown User"}</p>
                </div>
                <p>{comment.message}</p>
            </div>
    ))
  ) : (
    <p>No comments yet.</p>
  )}
</div>
          <div className="add-comment">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleCreateComment}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;

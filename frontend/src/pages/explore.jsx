import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../redux/slieces/postSlice";
import { useNavigate } from "react-router-dom";


const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { posts, loading, error } = useSelector((state) => state.allPosts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleViewPostDetails = (postId) => {
    if (postId) {
      navigate(`/post/${postId}`);
    } else {
      console.error("Post ID is undefined");
    }
  };

  return (
    <div className="explore-page">
      <h2>Explore</h2>
      {loading && <p>Loading posts...</p>}
      {error && <p>Error: {error}</p>}
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <img
              key={post._id}
              src={post.image}
              alt="Post"
              className="post-image"
              onClick={() => handleViewPostDetails(post._id)}
              style={{ cursor: "pointer" }}
            />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;

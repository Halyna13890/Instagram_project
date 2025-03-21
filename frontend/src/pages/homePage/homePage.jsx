import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, deletePost } from "../../redux/slieces/postSlice"; // Импортируем deletePost
import PostItem from "../../components/postItem/postItem";
import "./homePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.allPosts);

  
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  
  const handleDeletePost = async (postId) => {
    try {
      await dispatch(deletePost(postId)); 
      
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  console.log("Posts:", posts);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="page-content">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          !loading && <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
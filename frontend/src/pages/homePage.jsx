

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../redux/slieces/postSlice";
import PostItem from "../components/postItem/postItem";

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.allPosts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);
  console.log("Posts:", posts);
  return (
    <div >

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div>
        {posts.length > 0 ? (
          posts.map((post) => <PostItem key={post._id} post={post} />)
        ) : (
          !loading && <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

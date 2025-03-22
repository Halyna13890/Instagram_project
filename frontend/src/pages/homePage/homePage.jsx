import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../redux/slieces/postSlice";
import PostItem from "../../components/postItem/postItem";
import { useLocation } from "react-router-dom"; // Импортируем useLocation
import "./homePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.allPosts);
  const location = useLocation(); // Получаем объект location

  // Загружаем данные при каждом рендере или изменении location.key
  useEffect(() => {
    console.log("Загрузка постов..."); // Логируем загрузку
    dispatch(fetchAllPosts());
  }, [dispatch, location.key]); // Зависимость от location.key

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="page-content">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))
        ) : (
          !loading && <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
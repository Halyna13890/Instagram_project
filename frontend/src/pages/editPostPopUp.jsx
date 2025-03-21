import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts } from "../redux/slieces/postSlice";
import api from "../api/interceptor";
import defaultPhoto from "../accets/icons8-user-default-64.png";

const API_URL = import.meta.env.VITE_API_URL;

const EditPostPopUp = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  
  const { posts, loading, error } = useSelector((state) => state.allPosts);
  const post = posts.find((p) => p._id === postId);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    console.log("Запрашиваем посты...");
    dispatch(fetchAllPosts());
  }, [dispatch]);

  useEffect(() => {
    console.log("Изменился `post`:", post);
    if (post) {
      setText(post.text || "");
      setPreviewImage(post.image || null);
    }
  }, [postId, post]);

  const handleTextChange = (e) => setText(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      console.log("Выбрано изображение:", file.name);
    }
  };

  const handleUpdate = async () => {
    if (!post) {
      
      return;
    }

    const formData = new FormData();
    if (text !== post.text) formData.append("text", text);
    if (image) formData.append("image", image);

    if (!formData.has("text") && !formData.has("image")) {
      alert("Вы не внесли изменений");
      return;
    }

    console.log("Отправка данных на сервер:", {
      text: text !== post.text ? text : "(без изменений)",
      image: image ? image.name : "(без изменений)",
    });

    setLoadingUpdate(true);
    try {
      const response = await api.put(`${API_URL}/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      
      alert("Пост обновлён!");
      window.history.back();
    } catch (error) {
  
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) {
    
    return <p>Загрузка...</p>;
  }
  if (error) {
    
    return <p>Ошибка: {error}</p>;
  }
  if (!post) {
   
    return <p>Пост не найден</p>;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={() => window.history.back()}>&times;</button>

        <div className="user-info">
          <img 
            src={post?.user?.image || defaultPhoto} 
            alt={post?.user?.username || "Unknown user"} 
            className="user-avatar" 
          />
          <p>{post?.user?.username || "Unknown user"}</p>
        </div>

        <div className="image-preview">
          {previewImage ? (
            <img src={previewImage} alt="Preview" />
          ) : (
            <p>No image</p>
          )}
        </div>
        
        <label className="file-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <textarea value={text} onChange={handleTextChange} placeholder="Edit text..." />

        <button onClick={handleUpdate} disabled={loadingUpdate}>
          {loadingUpdate ? "loading..." : "Load"}
        </button>
      </div>
    </div>
  );
};

export default EditPostPopUp;

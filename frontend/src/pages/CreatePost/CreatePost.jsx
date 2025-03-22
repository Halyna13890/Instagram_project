import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/interceptor";
import "./createPost.css";

const API_URL = import.meta.env.VITE_API_URL;

const CreatePostPage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null); 

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !image) {
      setError("text and image are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("image", image);

      console.log("Отправка POST запроса для создания поста");
      const response = await api.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Ответ сервера:", response.data);

      setSuccess(true);
      alert("Post successfully created!");

      const postId = response.data.post._id;
      console.log("ID поста:", postId);

      if (!postId) {
        throw new Error("ID поста не определен в ответе сервера");
      }

      navigate(`/post/${postId}`);
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
      setError(err.response?.data?.error || "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <form onSubmit={handleSubmit}>
        <div className="type-share">
          <h1>Create new post</h1>
          <button
            className="create-post-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        <div className="image-text-area">
          <div className="image-area">
            <div className="prewiew-area">
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" className="preview" />
              </div>
            )}

            </div>
     
            <div className="image-upload">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              required
            />

          
            <button
              type="button"
              className="custom-file-upload"
              onClick={() => fileInputRef.current.click()} 
            >
              select file
            </button>

            
            {image && <p>selected file: {image.name}</p>}
            </div>
          </div>

          <div>
            <textarea
              id="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Write your post..."
              required
            />
          </div>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreatePostPage;
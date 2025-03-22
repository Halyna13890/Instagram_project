import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts, updatePost } from "../../redux/slieces/postSlice";
import api from "../../api/interceptor";
import defaultPhoto from "../../accets/icons8-user-default-64.png";
import "./editPostPopUp.css";

const API_URL = import.meta.env.VITE_API_URL;

const EditPostPopUp = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error } = useSelector((state) => state.allPosts);
  const post = posts.find((p) => p._id === postId);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  useEffect(() => {
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

    setLoadingUpdate(true);
    try {
      await dispatch(updatePost({ postId, updatedData: formData })).unwrap();
      alert("Пост обновлён!");
      navigate(-1);
    } catch (error) {
      console.error("Ошибка при обновлении поста:", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="create-post-page">
      <div className="type-share">
      <div className="user-info">
          <img
            src={post?.user?.image || defaultPhoto}
            alt={post?.user?.username || "Unknown user"}
            className="user-avt"
          />
          <p>{post?.user?.username || "Unknown user"}</p>
        </div>
        <h1>Edit Post</h1>

        <button
          className="create-post-btn"
          onClick={handleUpdate}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="image-text-area">
        <div className="image-area">
          <div className="prewiew-area">
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" className="preview" />
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
              className="hidden-file-input"
            />

            <button
              type="button"
              className="custom-file-upload"
              onClick={() => fileInputRef.current.click()}
            >
              Select File
            </button>

            {image && <p>Selected file: {image.name}</p>}
          </div>
        </div>

        <div>
          <textarea
            id="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Edit your post..."
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EditPostPopUp;
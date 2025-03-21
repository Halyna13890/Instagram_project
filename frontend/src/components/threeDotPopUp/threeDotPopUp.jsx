import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/interceptor";
import "./threeDot.css";

const API_URL = import.meta.env.VITE_API_URL;

const ThreeDotsMenu = ({ postId, onDelete }) => { // Добавлен пропс onDelete
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`${API_URL}/posts/${postId}`);
      console.log(response.data);
      alert("Post deleted successfully");

      // Вызываем функцию onDelete для обновления состояния на странице /home
      if (onDelete) {
        onDelete(postId);
      }

      // Перенаправляем на /home
      navigate("/home");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ошибка при удалении поста";
      alert(errorMessage);
      console.error("Error deleting post:", errorMessage);
    }
  };

  const handleEdit = () => {
    if (!postId) return alert("Error Post Id undefined.");
    navigate(`/post/edit/${postId}`);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="three-dots-menu">
      <button className="three-dot-btn" onClick={toggleMenu}>•••</button>

      {isOpen && (
        <div className="popup-menu" onClick={toggleMenu}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleMenu}>
              &times;
            </button>
            <ul>
              <li onClick={handleDelete}>Delete</li>
              <li onClick={handleEdit}>Edit</li>
              <li onClick={handleCopyLink}>Copy Link</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDotsMenu;
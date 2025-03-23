import React, { useState, useEffect } from "react";
import api from "../../api/interceptor";
import defaultPhoto from "../../accets/icons8-user-default-64.png";
import "./notification.css"

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {
  const [followersNotifications, setFollowersNotifications] = useState([]);
  const [likesNotifications, setLikesNotifications] = useState([]);
  const [commentsNotifications, setCommentsNotifications] = useState([]);

  
  const fetchFollowersNotifications = async () => {
    try {
      const response = await api.get(`${API_URL}/follow/time`);
      setFollowersNotifications(response.data);
    } catch (error) {
      console.error("Ошибка при получении уведомлений о подписках:", error);
    }
  };

  
  const fetchLikesNotifications = async () => {
    try {
      const response = await api.get(`${API_URL}/like/time`);
      setLikesNotifications(response.data);
    } catch (error) {
      console.error("Ошибка при получении уведомлений о лайках:", error);
    }
  };


  const fetchCommentsNotifications = async () => {
    try {
      const response = await api.get(`${API_URL}/comment/time`);
      setCommentsNotifications(response.data);
    } catch (error) {
      console.error("Ошибка при получении уведомлений о комментариях:", error);
    }
  };


  useEffect(() => {
    fetchFollowersNotifications();
    fetchLikesNotifications();
    fetchCommentsNotifications();
  }, []);


  const renderNotifications = (notifications) => {
    return notifications.map((notification) => (
      <div key={notification.id} className="notification-item">
        <div className="notification-content">
          <img
            src={notification.image || defaultPhoto}
            alt={notification.username}
            className="notification-avatar"
          />
          <div className="notification-text">
            <p className="notification-username">{notification.username}</p>
            <p className="notification-message">{notification.message}</p>
            <p className="notification-time">{notification.timeMessage}</p>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <div className="notifications-container">
      <h1>Notifications</h1>

    
      {followersNotifications.length > 0 && (
        <div className="notification-section">
          {renderNotifications(followersNotifications)}
        </div>
      )}

      
      {likesNotifications.length > 0 && (
        <div className="notification-section">
          {renderNotifications(likesNotifications)}
        </div>
      )}

      
      {commentsNotifications.length > 0 && (
        <div className="notification-section">
          {renderNotifications(commentsNotifications)}
        </div>
      )}
    </div>
  );
};

export default Notifications;
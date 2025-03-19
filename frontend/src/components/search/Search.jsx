import React, { useState, useEffect } from "react";
import api from "../../api/interceptor";
import { useNavigate } from "react-router-dom";
import defaultPhoto from "../../accets/icons8-user-default-64.png";

const API_URL = import.meta.env.VITE_API_URL;

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        try {
          const response = await api.get(`${API_URL}/user/search`, {
            params: { search: searchQuery },
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => fetchSearchResults(), 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search users..."
        className="search-input"
      />
      {searchResults.length > 0 && (
        <div>
          {searchResults.map((user) => (
            <div key={user._id} onClick={() => handleProfileClick(user._id)}>
              <img src={user.image|| defaultPhoto} alt={user.username} />
              <div>
                <p>{user.username}</p>
                <p>{user.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
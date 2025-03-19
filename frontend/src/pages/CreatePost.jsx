import React, { useState } from "react";
import api from "../api/interceptor"

const API_URL = import.meta.env.VITE_API_URL;

const CreatePostPage = () => {
  const [text, setText] = useState(""); 
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(false); 

 
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !image) {
      setError("Text and image are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      
      const formData = new FormData();
      formData.append("text", text);
      formData.append("image", image);

      
      const response = await api.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
      setSuccess(true);
      console.log("Post created successfully:", response.data);
    } catch (err) {
     
      setError(err.response?.data?.error || "Something went wrong");
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <h1>Create a New Post</h1>

   
      <form onSubmit={handleSubmit}>
     
        <div>
          <label htmlFor="text">Post Text:</label>
          <textarea
            id="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Write your post here..."
            required
          />
        </div>

    
        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

     
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>


      {error && <p className="error">{error}</p>}

      {success && <p className="success">Post created successfully!</p>}
    </div>
  );
};

export default CreatePostPage;
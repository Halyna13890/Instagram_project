import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../redux/slieces/authSlice";

const EditProfilePage = () => {
  const { userId } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const { user, loading, error } = useSelector((state) => state.auth);

 
  useEffect(() => {
    
  }, [user]);

  
  const [formData, setFormData] = useState({
    image: null,
    about: "",
    website: "",
  });

  
  useEffect(() => {
   
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  
  useEffect(() => {
    if (user) {
      
      setFormData({
        image: user.image || null,
        about: user.about || "",
        website: user.website || "",
      });
    }
  }, [user]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file, 
      }));
    }
  };

 
  const handleSave = async () => {
    const formDataToSend = new FormData();

    
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image); 
    } else if (formData.image !== user.image) {
      formDataToSend.append("image", formData.image); 
    }

    if (formData.about !== user.about) {
      formDataToSend.append("about", formData.about);
    }
    if (formData.website !== user.website) {
      formDataToSend.append("website", formData.website);
    }

   
    if (
      formData.image === user.image &&
      formData.about === user.about &&
      formData.website === user.website
    ) {
      alert("No changes");
      return;
    }

    try {
      await dispatch(updateUserProfile({ userId, userData: formDataToSend })).unwrap();
      alert("Profile updated!");
      navigate(`/profile/${userId}`);
    } catch (error) {
     
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      
      <div>
        <label htmlFor="image-upload">Upload image:</label>
        <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.image && (
          <img
            src={
              formData.image instanceof File
                ? URL.createObjectURL(formData.image) 
                : formData.image
            }
            alt="Profile"
          />
        )}
      </div>


      <div>
        <label htmlFor="about">About:</label>
        <textarea id="about" name="about" value={formData.about} onChange={handleChange} placeholder="About" />
      </div>

     
      <div>
        <label htmlFor="website">Website:</label>
        <input id="website" name="website" type="text" value={formData.website} onChange={handleChange} />
      </div>

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditProfilePage;
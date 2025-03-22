import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../../redux/slieces/authSlice";
import "./EditProfile.css";

const EditProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    image: null,
    about: "",
    website: "",
  });

  const fileInputRef = useRef(null); 

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
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="edit-page">
      <div className="photo-area">
      {formData.image && (
          <img
            src={
              formData.image instanceof File
                ? URL.createObjectURL(formData.image)
                : formData.image
            }
            alt="Profile"
            className="profile-img" 
          />
        )}

        <div className="about-foto-area">
        {formData.about}
        </div>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden-file-input"
        />
       
        <button
          className="custom-file-upload"
          onClick={() => fileInputRef.current.click()} 
        >
          Choose File
        </button>
        
      
        {/* {formData.image instanceof File && (
          <p>Selected file: {formData.image.name}</p>
        )} */}
      </div>

      <div>
        <p className="edit-profile-label">Website:</p>
        <input
          id="website"
          name="website"
          type="text"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div>
        <p className="edit-profile-label">About:</p>
        <textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="About"
        />
      </div>

      <button className="btn-edit-profile" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};


export default EditProfilePage;
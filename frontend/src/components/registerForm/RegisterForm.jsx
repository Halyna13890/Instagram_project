import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slieces/authSlice";
import { useNavigate } from "react-router-dom";
import ichgram from "../../accets/ICHGRA.jpg";
import { Link } from "react-router-dom";
import "./registerForm.css";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(registerUser(data)).unwrap();
      if (response) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div>
      <div>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <img src={ichgram} alt="Ichgram" />
          <h5 className="register-promo-text">Sign up to see photos and videos from your friends.</h5>

          <div className="register-input-area">
           
            <input
              className="register-input"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
              })}
              placeholder="Email"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}

            
            <input
              className="register-input"
              {...register("fullName", { required: "Full name is required" })}
              placeholder="Full Name"
            />
            {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}

           
            <input
              className="register-input"
              {...register("username", { required: "Username is required" })}
              placeholder="Username"
            />
            {errors.username && <p className="error-message">{errors.username.message}</p>}

            <input
              className="register-input"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              placeholder="Password"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

         
          {error && <p className="error-message">{error.message || "Registration failed"}</p>}

          
          <div className="info-btn-area">
            <h5>
              People who use our service may have uploaded your contact information to Instagram.{" "}
              <span className="highlight">Learn More</span>
            </h5>
            <h5>
              By signing up, you agree to our <span className="highlight">Terms</span>,{" "}
              <span className="highlight">Privacy Policy</span> and{" "}
              <span className="highlight">Cookies Policy</span>
            </h5>

            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>

      <div className="login-link-area">
        <h4>
          Have an account? <Link className="login-link" to="/login">Log in</Link>
        </h4>
      </div>
    </div>
  );
};

export default RegisterForm;
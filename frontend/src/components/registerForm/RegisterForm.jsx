import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slieces/registerSlice";
import { useNavigate } from "react-router-dom";
import ichgram from "../../accets/ICHGRA.jpg"
import { Link } from "react-router-dom"

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

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
                <img src={ichgram} alt="Ichgram" />
                <h5>Sign up to see photos and videos from your friends.</h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
                        })}
                        placeholder="Email"
                    />
                    {errors.email && <p>{errors.email.message}</p>}

                    <input {...register("fullName", { required: "Full name is required" })} placeholder="Full Name" />
                    {errors.fullname && <p>{errors.fullname.message}</p>}

                    <input {...register("username", { required: "Username is required" })} placeholder="Username" />
                    {errors.username && <p>{errors.username.message}</p>}

                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                        placeholder="Password"
                    />
                    {errors.password && <p>{errors.password.message}</p>}

                    <div>
                        <h5>People who use our service may have uploaded your contact information to Instagram. Learn More</h5>
                    </div>

                    <div>
                        <h5>By signing up, you agree to our Terms, Privacy Policy and Cookies Policy</h5>
                    </div>

                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
                </form>
            </div>

            <div>
                <h4>Have an account? <Link to="/login">Log in</Link></h4>
            </div>
        </div>
    );
};

export default RegisterForm;

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slieces/authSlice";
import ichgram from "../../accets/ICHGRA.jpg"
import mobile from "../../accets/mobile.jpg"
import { Link } from "react-router-dom";
import "./loginForm.css"

const LoginForm = () => {
    const dispach = useDispatch()
    const navigate = useNavigate()
    const {loading, error} = useSelector((state => state.auth))
    const {register, handleSubmit, formState: {errors}} = useForm()

    const onSubmit = async(data) => {
        const result = await dispach(loginUser(data))
        if(result.payload){
            navigate("/home")
        }
    }

    return(
        <div className="login-page">
            <div>
                <img src={mobile} alt="instagram" />
            </div>
           <div>
           <div >
                
                <form  onSubmit={handleSubmit(onSubmit)}
                className="login-form">
                <img src={ichgram} alt="Ichgram"/>
                <input 
                  className="login-input"
          placeholder="Email" 
          type="email" 
          {...register("email", { required: "Email is required" })} 
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input 
        className="login-input"
          placeholder="Password" 
          type="password" 
          {...register("password", { required: "Password is required" })} 
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={loading}
        className="login-btn">
          {loading ? "Logging in..." : "Login"}
        </button>
                </form>
            </div>
            <div className="register-link">
                 <h4>Don't have an account?<Link className="sign-up-link" to="/register">Sign up</Link></h4>
            </div>
           </div>
        </div>
    )
}

export default LoginForm;
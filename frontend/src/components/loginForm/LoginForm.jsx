import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slieces/authSlice";
import ichgram from "../../accets/ICHGRA.jpg"
import { Link } from "react-router-dom";


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
        <div>
            <div>
                <img src={ichgram} alt="Ichgram"/>
                <form onSubmit={handleSubmit(onSubmit)}>
                <input 
          placeholder="Email" 
          type="email" 
          {...register("email", { required: "Email is required" })} 
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input 
          placeholder="Password" 
          type="password" 
          {...register("password", { required: "Password is required" })} 
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
                </form>
            </div>
            <div>
                 <h4>Don't have an account?<Link to="/register">Sign up</Link></h4>
            </div>
        </div>
    )
}

export default LoginForm;
import { useForm } from "react-hook-form";
import axios from "axios";
import "./login.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {toast,Toaster} from 'react-hot-toast'
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
let navigate=useNavigate()
const onSubmit = async (data) => {
  const loadingToast = toast.loading("Logging in...");

  try {
    const res = await axios.post(`${import.meta.env.VITE_FRONT}/login`, data);
    toast.dismiss(loadingToast); // Remove loading toast

    if (res.data.message === "success") {

      localStorage.setItem("cookie", res.data.token);
      toast.success("Login Successful 🎉");
      setTimeout(()=>
      {
        navigate("/home");
      },2000)
    
    } else {
      toast.error(res.data.message || "Invalid credentials ❌");
    }
  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error("Something went wrong! ❌");
    console.error("Login error:", err);
  }
};

  return (
    <div className="container">
      <Toaster/>
      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <h2 className="fo"><h1>Login</h1></h2>

        <label className="form-label">UID:</label>
        <input
          {...register("uid", { required: "UID is required" })}
          className="form-input"
          placeholder="Enter your UID"
        />
        {errors.uid && <p className="error-text">{errors.uid.message}</p>}

        <label className="form-label">Password:</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="form-input"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}

        <button type="submit" className="submit-button">
          Login
        </button>
       <NavLink to="/"> <button id="btn" className="submit-button">
         Signup
        </button></NavLink>
      </form>
    
    </div>
  );
}

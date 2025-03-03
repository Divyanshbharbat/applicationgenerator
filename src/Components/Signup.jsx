import { useForm } from "react-hook-form";
import axios from 'axios';
import "./signup.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {toast,Toaster} from 'react-hot-toast'
export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
let navigate=useNavigate()
  const onSubmit = async (data) => {
    
    await axios.post(`${import.meta.env.VITE_FRONT}/signup`, data).then((res)=>{
      if(res.data.message=="success")
      { 
       
        toast.success("Signup Successfully")
        setTimeout(() => {
          navigate("/login")
        }, 2000);
        
      }
      else{
        toast.error("Something went wrong")
      }
    }).catch((err)=>
    { toast.error("Uid Already Registered")
 
    })
  };

  return (
   <div className="container-fluid ">
    <Toaster/>
     <div className="container ">
      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <h2 className="fo py-2 my-3"><h1>Signup</h1></h2>

        <label className="form-label">Name:</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="form-input"
          placeholder="Enter your name"
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}

        <label className="form-label">UID (Unique):</label>
        <input
          {...register("uid", { required: "UID is required" })}
          className="form-input"
          placeholder="Enter unique UID"
        />
        {errors.uid && <p className="error-text">{errors.uid.message}</p>}

        <label className="form-label">Roll Number (Unique):</label>
        <input
          {...register("roll", { required: "Roll number is required" })}
          className="form-input"
          placeholder="Enter unique roll number"
        />
        {errors.roll && <p className="error-text">{errors.roll.message}</p>}

        <label className="form-label">Year:</label>
        <select {...register("year", { required: "Year is required" })} className="form-input">
          <option value="">Select Year</option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
          <option value="4">4th</option>
        </select>
        {errors.year && <p className="error-text">{errors.year.message}</p>}

        <label className="form-label">Branch:</label>
        <select {...register("branch", { required: "Branch is required" })} className="form-input">
          <option value="">Select Branch</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electrical">Electrical</option>
          <option value="Data Science">Data Science</option>
        </select>
        {errors.branch && <p className="error-text">{errors.branch.message}</p>}

        <label className="form-label">Password:</label>
        <input
          type="password"
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
          className="form-input"
          placeholder="Enter password"
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}

        <button type="submit" className="submit-button">Signup</button>
       <NavLink to="/login" > <button id="btn" className="submit-button">Login</button></NavLink>
      </form>
    </div>
   </div>
  );
}
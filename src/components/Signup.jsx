import React, { useState, useLayoutEffect } from "react";
import '../styles/Signup.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar2 from "./Navbar2";
import toast from "react-hot-toast";


const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    const handleSignup = async (e) => {
        e.preventDefault();
        const userInfo = {
            email,
            password
        }

        if (email == "" || password == "") {
            toast.error("Email or password cannot be empty");
        }
        else if(password.length < 8){
            toast.error("Password must be at least 8 characters.")
        }
        else {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userInfo)
                });

                if (!response.ok) {
                    const responseData = await response.text();
                    if (response.status === 500) {
                        if(responseData.includes("Error sending mail")) toast.error("Error sending verification mail. Please try again later");
                        else toast.error("Something went wrong on the server. Please try again later");
                    } else if (response.status === 409) {
                        toast.error("Email already exists \nTry logging in");
                    } else if (response.status === 406) {
                        toast.error("Email or password cannot be empty");
                    } else if (response.status === 429) {
                        toast.error("Too many requests, please try again later");
                    }
                    throw new Error(`Server error: ${response.status}`);
                }

                sessionStorage.setItem("email",email);
                toast.success("Verification code sent to your email");
                navigate("/verify");

                setEmail("");
                setPassword("");

            } catch (error) {
                if (error.message === "Failed to fetch") {
                    toast.error("Failed to connect to the server. Please try again later");
                }
                else{
                    toast.error("Something went wrong on the server. Please try again later")
                }
            } finally {
                setLoading(false); 
            }
        }

    }

    return (
        <>
            <div className="container">

                <Navbar2 />

                <form onSubmit={handleSignup} className="auth-container">
                    <div className="auth-heading">Signup</div>
                    <div className="input-fields">
                        <div className="input-field">
                            <div className="input-label">Email</div>
                            <input type="email" className="input-box" placeholder="youremail@example.com" onChange={(e) => setEmail(e.target.value)} disabled={loading}></input>
                        </div>
                        <div className="input-field">
                            <div className="input-label">Password</div>
                            <input type="password" className="input-box" placeholder="strong password" onChange={(e) => setPassword(e.target.value)} disabled={loading}></input>
                        </div>

                    </div>
                    <div className="submit-section">
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? "Creating account for you..." : "Signup"}
                        </button>
                        <div className="already-have">Already have an account? <Link to={"/login"} className="login-link"><b>Login</b></Link></div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Signup
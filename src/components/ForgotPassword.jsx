import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-hot-toast";
import Navbar2 from "./Navbar2";
import '../styles/Login.css'


const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    const handleForgotPassword = async (e) => {

        e.preventDefault();

        if (email == "") {
            toast.error("Email cannot be empty");
        }
        else {
            setLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: email
                });

                let responseData;
                try {
                    responseData = await response.clone().json();
                } catch {
                    responseData = await response.text();
                }

                //failed to send email
                if (!response.ok) {
                    if (response.status === 404) {
                        toast.error("User not found");
                    } else if (response.status === 400) {
                        toast.error("Email cannot be empty");
                    } else if (response.status === 429) {
                        toast.error("Too many requests, please try again later");
                    } else if (response.status === 500) {
                        toast.error("Something went wrong on the server. Please try again later");
                    } else {
                        throw new Error("Verification failed with status: " + response.status);
                    }
                }
                else {

                    //email sent navigate to update password
                    sessionStorage.setItem("email", email);
                    toast.success("Password reset verification code sent");
                    navigate("/forgot/passwordupdate");
                }

            } catch (error) {
                toast.error("Something went wrong. Please try again later")
                navigate("/forgot");
                // console.error("Verification failed");
            } finally {
                setLoading(false); 
            }
        }
    }

    return (
        <>
            <div className="container">

                <Navbar2 />

                <form onSubmit={handleForgotPassword} className="auth-container">
                    <div className="auth-heading">Forgot Password</div>
                    <div className="input-fields">
                        <div className="input-field">
                            <div className="input-label">Email</div>
                            <input type="email" className="input-box" placeholder="youremail@example.com" onChange={(e) => setEmail(e.target.value)} disabled={loading}></input>
                        </div>

                    </div>
                    <div className="submit-section">
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default ForgotPassword;
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-hot-toast";
import Navbar2 from "./Navbar2";
import '../styles/Login.css'
import Cookies from "js-cookie";



const Verifycode = () => {

    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(["", "", "", "", "", ""]);

    const navigate = useNavigate();

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("email");

        if (savedEmail) {
            setEmail(sessionStorage.getItem("email"));
        } else {
            navigate("/login");
        }
    }, [navigate])

    const handleVerify = async (e) => {

        e.preventDefault();
        const userVerify = {
            email: email,
            code: code
        }

        if (email == "" || code == "") {
            toast.error("Verification code cannot be empty");
        }
        else {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userVerify)
                });

                let responseData;
                try {
                    responseData = await response.clone().json();
                } catch {
                    responseData = await response.text();
                }

                //verification failed
                if (!response.ok) {
                    if (response.status === 400) {
                        if (responseData.includes("Code expired")) {
                            toast.error("Verification code expired");
                            //resend and reverify
                        } else if (responseData.includes("Invalid code")) {
                            toast.error("Invalid code");
                        } else {
                            toast.error("Something went wrong on the server. Please try again later");
                        }
                    } else if (response.status === 404) {
                        toast.error("User not found");
                    } else if (response.status === 429) {
                        toast.error("Too many requests, please try again later");
                    } else if (response.status === 500) {
                        toast.error("Something went wrong on the server. Please try again later");
                    } else {
                        throw new Error("Verification failed with status: " + response.status);
                    }
                } else {

                    //verification sucessful redirect to dashboard
                    //generate token

                    sessionStorage.setItem("isLogin", response.ok);
                    sessionStorage.setItem("username", responseData.username);
                    Cookies.set("token", responseData.token, { expires: 10 / 1440, secure: true });
                    sessionStorage.removeItem("email");

                    toast.success(`Welcome ${responseData.username}`)
                    navigate("/dashboard");
                }

            } catch (error) {
                // console.error("Verification failed");
            } finally {
                setLoading(false);
            }
        }
    }

    const handleResend = async () => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: email
            });
            toast.success("Verification code resent");

        } catch (error) {
            toast.error("Failed to connect to the server. Please try again later");
        }
    }

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
        setCode(newValues.join(""));

        // Move to next box if input is valid
        if (value && index < 5) {
            document.getElementById(`digit-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            document.getElementById(`digit-${index - 1}`).focus();
        }
    };

    return (
        <>
            <div className="container">

                <Navbar2 />

                <form onSubmit={handleVerify} className="auth-container">
                    <div className="auth-heading">Verify Email</div>
                    <div className="input-fields">
                        
                        <div className="input-field">
                            <div className="input-label"></div>
                            <div className="input-container">
                                {values.map((val, index) => (
                                    <input
                                        key={index}
                                        id={`digit-${index}`}
                                        type="text"
                                        maxLength="1"
                                        className="digit-box"
                                        value={val}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="submit-section">
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? "Verifying..." : "Continue"}
                        </button>
                        <div className="already-have"><Link onClick={handleResend} className="login-link">Resend verification code</Link></div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Verifycode;
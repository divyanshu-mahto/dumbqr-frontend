import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-hot-toast";
import Navbar2 from "./Navbar2";
import '../styles/Login.css'
import Cookies from "js-cookie";



const ForgotPasswordUpdate = () => {

    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(["", "", "", "", "", ""]);

    const navigate = useNavigate();

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("email");

        if (savedEmail) {
            setEmail(sessionStorage.getItem("email"));
        } else {
            navigate("/forgot");
        }
    }, [navigate])

    const handleForgotPasswordUpdate = async (e) => {

        e.preventDefault();
        const userVerify = {
            email: email,
            code: code,
            newPassword: newPassword
        }

        if (newPassword == "" || code == "") {
            toast.error("Verification code or password cannot be empty");
        }
        else if (newPassword != reNewPassword) {
            toast.error("Password mismatch");
        }
        else if (password.length < 8) {
            toast.error("Password must be at least 8 characters.")
        }
        else {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot/changepassword`, {
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
                                        if(responseData.includes("Error sending mail")){
                                            toast.error("Failed to send verification mail. Please try again later");
                                            navigate("/forgot");
                                        }
                                        toast.error("Something went wrong on the server. Please try again later");
                                    } else {
                                        throw new Error("Verification failed with status: " + response.status);
                                    }
                                }
                                toast.success("Resent verification code");
                            } catch (error) {
                                toast.error("Something went wrong. Please try again later")
                                navigate("/forgot");
                                // console.error("Verification failed");
                            }

                        } else if (responseData.includes("Invalid code")) {
                            toast.error("Invalid code");
                        } else if(responseData.includes("Error sending mail")){
                            toast.error("Failed to send verification mail. Please try again later");
                        } else {
                            toast.error("Invalid code or password");
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
                }
                else {

                    //verification sucessful , password updated, redirect to dashboard
                    //generate token

                    sessionStorage.setItem("isLogin", response.ok);
                    sessionStorage.setItem("username", responseData.username);
                    Cookies.set("token", responseData.token, { expires: 10 / 1440, secure: true });
                    sessionStorage.removeItem("email");

                    toast.success("Password updated");
                    toast.success(`Welcome ${responseData.username}`);
                    navigate("/dashboard");
                }

            } catch (error) {
                toast.error("Something went wrong. Please try again later")
                // console.error("Verification failed");
            } finally {
                setLoading(false);
            }
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

    const handleResend = async () => {

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

                //email resent
                toast.success("Verification code resent");
            }

        } catch (error) {
            toast.error("Something went wrong. Please try again later")
            navigate("/forgot");
            // console.error("Verification failed");
        }
    }

    return (
        <>
            <div className="container">

                <Navbar2 />

                <form onSubmit={handleForgotPasswordUpdate} className="auth-container">
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
                        <div className="input-field">
                            <div className="input-label">New Password</div>
                            <input type="password" className="input-box" placeholder="new password" onChange={(e) => setNewPassword(e.target.value)} disabled={loading}></input>
                        </div>
                        <div className="input-field">
                            <div className="input-label">Re-Enter Password</div>
                            <input type="password" className="input-box" placeholder="new password" onChange={(e) => setReNewPassword(e.target.value)} disabled={loading}></input>
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

export default ForgotPasswordUpdate;
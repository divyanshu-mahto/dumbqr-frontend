import React, { useState, useLayoutEffect } from "react"
import '../styles/Login.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar2 from "./Navbar2";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    const handleLogin = async (e) => {

        e.preventDefault();
        const userInfo = {
            email: email,
            password: password
        }
        if (email == "" || password == "") {
            toast.error("Email or password cannot be empty");
        }
        else {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userInfo)
                });


                if (!response.ok) {
                    const text = await response.text();
                    if (response.status === 401) {
                        if (text.includes("Account not verified")) {
                            //send verification code
                            sessionStorage.setItem("email", email);
                            try {
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resend`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: email
                                });

                                navigate("/verify");
                                toast.success("Verification code sent to your email");

                            } catch (error) {
                                toast.error("Failed to connect to the server. Please try again later");
                            }
                            navigate("/verify");
                        } else {
                            toast.error("Incorrect email or password");
                        }
                    } else if (response.status === 429) {
                        toast.error("Too many requests, please try again later");
                    } else if (response.status === 500) {
                        if (text == "Error sending mail") {
                            toast.error("Account not verified");
                            toast.error("Failed to send verification mail. Please try again later");
                        } else {
                            toast.error("Something went wrong on the server. Please try again later");
                        }
                    } else {
                        throw new Error("Login failed with status: " + response.status);
                    }
                }

                const responseData = await response.json()

                sessionStorage.setItem("isLogin", response.ok);
                sessionStorage.setItem("username", responseData.username);
                Cookies.set("token", responseData.token, { expires: 10 / 1440, secure: true });

                toast.success(`Welcome ${responseData.username}`)
                navigate("/dashboard");

                setEmail("");
                setPassword("");

            } catch (error) {
                if (error.message === "Failed to fetch") {
                    toast.error("Failed to connect to the server. Please try again later");
                } else{
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

                <form onSubmit={handleLogin} className="auth-container">
                    <div className="auth-heading">Login</div>
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
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        <Link to={"/forgot"} className="login-link">Forgot password?</Link>
                        <div className="already-have">Don't have an account? <Link to={"/signup"} className="login-link"><b>Signup</b></Link></div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Login
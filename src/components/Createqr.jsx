import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import '../styles/Createqr.css'
import { Link, useParams, useNavigate, redirect, useLocation } from 'react-router-dom'
import Navbar2 from "./Navbar2";
import toast from "react-hot-toast";
import Cookies from "js-cookie";


const CreateQrCard = React.memo(({ name, redirectUrl, shortId, qrcode, foreground, background, onNameChange, onShortIdChange, onRedirectUrlChange, onForegroundChange, onBackgroundChange, onSubmit, loading }) => {

    const imageSrc = `data:image/png;base64,${qrcode}`;

    return (
        <div className="edit-qr-code">
            <div className="qr-card-edit">
                <div className="qr-code-name-small">{name}</div>
                <div className="edit-qr-image">
                    {qrcode ? (<img src={imageSrc} height={250} />) : (<div className="loader"></div>)}

                </div>
                <div className="qr-details-container">
                    <div className="qr-info-container">
                        <div className="qr-details">
                            <div className="qr-code-name">{name}</div>
                            <div className="qr-info">
                                <div className="edit-qr-redirect">
                                    <div className="edit-qr-redirect-heading">Redirects to:</div>
                                    <div className="edit-qr-redirect-link">{redirectUrl}</div>
                                </div>
                                <div className="edit-qr-redirect">
                                    <div className="edit-qr-redirect-heading">Short URL:</div>
                                    <div className="edit-qr-redirect-link">{import.meta.env.VITE_API_URL}/{shortId}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="settings-container">
                <div className="qr-settings">
                    <div className="settings-heading">Settings</div>
                    <div className="input-field-1">
                        <div className="input-label-container">
                            <div className="input-label">QR code name</div>
                        </div>
                        <input className="input-box" type="text" placeholder="QR code name" value={name} onChange={onNameChange}></input>
                    </div>
                    <div className="input-field-1">
                        <div className="input-label-container">
                            <div className="input-label">Short URL</div>
                        </div>
                        <input className="input-box" type="text" placeholder="shortId" value={shortId} onChange={onShortIdChange}></input>
                    </div>
                    <div className="input-field-1">
                        <div className="input-label-container">
                            <div className="input-label">Redirect to</div>
                        </div>
                        <input className="input-box" type="text" placeholder="your url" value={redirectUrl} onChange={onRedirectUrlChange}></input>
                    </div>
                </div>
                <div className="qr-appearance">
                    <div className="settings-heading">Appearance</div>
                    <div className="input-field-2">
                        <div className="input-2-label">Foreground color</div>
                        <input className="input-2-box" type="color" value={foreground} onChange={onForegroundChange}></input>
                    </div>
                    <div className="input-field-2">
                        <div className="input-2-label">Background color</div>
                        <input className="input-2-box" type="color" value={background} onChange={onBackgroundChange}></input>
                    </div>
                    <div className="create-button-container-large">
                        <button className="create-button-large" onClick={onSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Create QR Code"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="qr-action-buttons-conatiner">
                <button className="save-changes-button" onClick={onSubmit} disabled={loading}>
                    {loading ? "Creating..." : "Create QR Code"}
                </button>
            </div>
        </div>
    )
})


const Createqr = () => {
    const [name, setName] = useState("My New QR");
    const [shortId, setShortId] = useState("");
    const [redirectUrl, setRedirectUrl] = useState("");
    const [foreground, setForeground] = useState("#000000");
    const [background, setBackground] = useState("#FFFFFF");
    const [qrcode, setQrcode] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    const generateQr = useCallback(async (e) => {

        const qrCode = {
            shortId: shortId,
            foreground: "FF" + foreground.replace("#", "").toUpperCase(),
            background: "FF" + background.replace("#", "").toUpperCase()
        }

        const token = Cookies.get("token");


        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/qrimage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(qrCode)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired");

                    Cookies.remove("isLogin");
                    Cookies.remove("token");
                    sessionStorage.removeItem("username");
                    sessionStorage.removeItem("userQrCodes");

                    navigate("/login")
                } else if (response.status === 400) {
                    toast.error("Short URL contains a reserved keyword \nChoose some other short URL")
                } else if (response.status === 406) {
                    toast.error("Short URL is already taken. Choose some other short URL");
                } else if (response.status === 429) {
                    toast.error("Too many requests, please try again later");
                } else {
                    toast.error("QR code image generation failed");
                }
            } else {

                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64Data = reader.result.split(',')[1];
                    setQrcode(base64Data);
                };
            }

        } catch (error) {
            navigate("/dashboard");
            toast.error("Error creating QR code, please try again later");
        }
    }, [shortId, foreground, background])


    useEffect(() => {
        generateQr();
    }, []);

    useEffect(() => {
        generateQr();
    }, [shortId, foreground, background]);

    useEffect(() => {
        const savedIsLogin = Cookies.get("isLogin");
        const savedToken = Cookies.get("token");

        if (!savedIsLogin && !savedToken) {
            navigate("/login");
        }

    }, [navigate])

    const handleSubmit = async (e) => {
        const qrCode = {
            name: name,
            shortId: shortId,
            redirectUrl: redirectUrl,
            foreground: "FF" + foreground.replace("#", "").toUpperCase(),
            background: "FF" + background.replace("#", "").toUpperCase()
        }
        if (name == "" || shortId == "" || redirectUrl == "") {
            toast.error("All fields are required");
        }
        else if (`${import.meta.env.VITE_API_URL}/${shortId}` == redirectUrl) {
            toast.error("Short URL cannot be same as redirect URL");
        }
        else {
            setLoading(true);
            const token = Cookies.get("token");

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/createqr`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(qrCode)
                });

                const responseData = response.text();

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("Session expired");

                        Cookies.remove("isLogin");
                        Cookies.remove("token");
                        sessionStorage.removeItem("username");
                        sessionStorage.removeItem("userQrCodes");

                        navigate("/login")
                    } else if (response.status === 406) {
                        toast.error("Short URL is already taken. Choose some other short URL");
                    } else if (response.status === 400) {
                        if (responseData == "ShortURL or RedirectURL empty") toast.error("Short URL or Redirect URL cannot be empty");
                        else toast.error("Short URL contains a reserved keyword \nChoose some other short URL")
                    } else if (response.status === 429) {
                        toast.error("Too many requests, please try again later");
                    } else if (response.status === 500) {
                        toast.error("Something went wrong, please try again later");
                    } else {
                        throw new Error("QR code creation failed: " + response.status);
                    }
                }
                else {
                    toast.success("QR code created");
                    navigate("/dashboard");
                }


            } catch (error) {
                toast.error("Error creating QR code, please try again later");
            } finally {
                setLoading(false);
            }
        }
    }



    const handleNameChange = useCallback((e) => {
        setName(e.target.value);
    }, []);

    const handleShortIdChange = useCallback((e) => {
        setShortId(e.target.value);
    }, []);

    const handleRedirectUrlChange = useCallback((e) => {
        setRedirectUrl(e.target.value);
    }, []);

    const handleForegroundChange = useCallback((e) => {
        setForeground(e.target.value);
    }, []);

    const handleBackgroundChange = useCallback((e) => {
        setBackground(e.target.value);
    }, []);


    return (
        <>
            <div className="container">

                <Navbar2 name={sessionStorage.getItem("username")} />

                <div className="outer-container-edit">

                    <div className="navigate-back">
                        <div className="back-icon" onClick={() => navigate('/dashboard')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12" fill="none">
                                <path d="M0.936467 5.46967C0.643574 5.76256 0.643574 6.23744 0.936467 6.53033L5.70944 11.3033C6.00233 11.5962 6.4772 11.5962 6.7701 11.3033C7.06299 11.0104 7.06299 10.5355 6.7701 10.2426L2.52746 6L6.7701 1.75736C7.06299 1.46447 7.06299 0.989592 6.7701 0.696699C6.4772 0.403806 6.00233 0.403806 5.70944 0.696699L0.936467 5.46967ZM1.4668 6.75L23.5752 6.75L23.5752 5.25L1.4668 5.25L1.4668 6.75Z" fill="black" />
                            </svg>
                        </div>
                        <div className="page-heading">Create new QR code</div>
                    </div>

                    <div className="editqr-container">
                        <CreateQrCard
                            name={name}
                            redirectUrl={redirectUrl}
                            shortId={shortId}
                            qrcode={qrcode}
                            foreground={foreground}
                            background={background}
                            onNameChange={handleNameChange}
                            onShortIdChange={handleShortIdChange}
                            onRedirectUrlChange={handleRedirectUrlChange}
                            onForegroundChange={handleForegroundChange}
                            onBackgroundChange={handleBackgroundChange}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    </div>

                </div>

            </div>
        </>
    )
}

export default Createqr
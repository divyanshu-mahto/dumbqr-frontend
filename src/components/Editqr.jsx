import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import '../styles/Editqr.css'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import Navbar2 from "./Navbar2";
import toast from "react-hot-toast";
import Cookies from "js-cookie";


const EditQrCard = React.memo(({ qr, qrname, redirectUrl, onQrnameChange, onRedirectUrlChange, onDeleteQr, onSaveChanges, onDownloadQr, onAnalytics, saveLoading, deleteLoading }) => {

    const imageSrc = `data:image/png;base64,${qr.qrcode}`;

    return (
        <div className="edit-qr-code">
            <div className="qr-card-edit">
                <div className="qr-code-name-small">{qrname}</div>
                <div className="edit-qr-image" style={{ backgroundColor: `#${qr.background.substring(2)}` }}>
                    <img src={imageSrc} height={250} />
                </div>
                <div className="qr-details-container">
                    <div className="qr-info-container">
                        <div className="qr-details">
                            <div className="qr-code-name">{qrname}</div>
                            <div className="qr-info">
                                <div className="edit-qr-redirect">
                                    <div className="edit-qr-redirect-heading">Redirects to:</div>
                                    <div className="edit-qr-redirect-link">{redirectUrl}</div>
                                </div>
                                <div className="edit-qr-redirect">
                                    <div className="edit-qr-redirect-heading">Short URL:</div>
                                    <div className="edit-qr-redirect-link">{import.meta.env.VITE_API_URL}/{qr.shortId}</div>
                                </div>
                                <div className="qr-scans-count">
                                    <div className="qr-scans-count-heading">Total scans:</div>
                                    <div className="qr-scans-count-num">{qr.scans}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="qr-button-container">
                        <button className="download-qr-button" onClick={onDownloadQr}>Download QR code</button>
                        <button className="analytics-button-medium" onClick={() => onAnalytics(qr.shortId)}>Analytics</button>
                    </div>
                </div>
                <button className="qr-analytics-button" onClick={() => onAnalytics(qr.shortId)}>Analytics</button>
            </div>
            <div className="settings-container">
                <div className="qr-settings">
                    <div className="settings-heading">Settings</div>
                    <div className="input-field-1">
                        <div className="input-label-container">
                            <div className="input-label">QR code name</div>
                        </div>
                        <input className="input-box" type="text" value={qrname} onChange={onQrnameChange}></input>
                    </div>
                    <div className="input-field-1">
                        <div className="input-label-container">
                            <div className="input-label">Redirect to</div>
                        </div>
                        <input className="input-box" type="text" value={redirectUrl} onChange={onRedirectUrlChange}></input>
                    </div>
                </div>
            </div>
            <div className="edit-qr-action-buttons-conatiner">
                <button className="delete-qr-button" onClick={onDeleteQr} disabled={deleteLoading}>
                    {deleteLoading ? "Deleting..." : "Delete"}
                </button>
                <button className="save-changes-button" onClick={onSaveChanges} disabled={saveLoading}>
                    {saveLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    )
})

const Editqr = () => {

    const { id } = useParams();

    const navigate = useNavigate();
    const [qrname, setQrname] = useState("");
    const [redirectUrl, setRedirectUrl] = useState("");
    const [shortId, setShortId] = useState("");
    const [qr, setQr] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    const handleQrnameChange = useCallback((e) => {
        setQrname(e.target.value);
    }, []);

    const handleRedirectUrlChange = useCallback((e) => {
        setRedirectUrl(e.target.value);
    }, []);

    const handleAnalytics = (shortId) => {
        navigate(`/analytics/${shortId}`);
    };


    useEffect(() => {
        const savedIsLogin = sessionStorage.getItem("isLogin");
        const savedToken = Cookies.get("token");

        if (!savedIsLogin && !savedToken) {
            navigate("/login");
        }

        const userQrCodes = JSON.parse(sessionStorage.getItem("userQrCodes")) || [];

        const selectedQr = userQrCodes.find(qr => qr.shortId === id);

        if (!selectedQr) {
            toast.error("QR code not found");
            navigate("/dashboard");
            return;
        }

        if (selectedQr) {
            setQr(selectedQr);
            setQrname(selectedQr.name);
            setRedirectUrl(selectedQr.redirectUrl);
            setShortId(selectedQr.shortId);
        }

    }, [id, navigate])

    if (!qr) {
        return;
    }

    const handleSaveChanges = async (e) => {

        const token = Cookies.get("token");
        const newQrCode = {
            name: qrname,
            redirectUrl: redirectUrl,
        }

        if (`${import.meta.env.VITE_API_URL}/${shortId}` == redirectUrl) {
            toast.error("Short URL cannot be same as redirect URL");
        }
        else {
            setSaveLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/update/${shortId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(newQrCode)
                });

                const responseData = response.text();

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("Session expired");

                        sessionStorage.removeItem("isLogin");
                        Cookies.remove("token");
                        sessionStorage.removeItem("username");
                        sessionStorage.removeItem("userQrCodes");

                        navigate("/login");
                    } else if (response.status === 404) {
                        toast.error("QR code not found");
                    } else if (response.status === 500) {
                        toast.error("Something went wrong, please try again later");
                    } else if (response.status === 429) {
                        toast.error("Too many requests, please try again later");
                    }
                    throw new Error("QR code updation failed: " + response.status);
                }

                toast.success("QR code updated");
                navigate("/dashboard");


            } catch (error) {
            } finally{
                setSaveLoading(false);
            }
        }
    };


    const handleDeleteQr = async (e) => {

        const token = Cookies.get("token");

        setDeleteLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/${shortId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const responseData = response.text();

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired");

                    sessionStorage.removeItem("isLogin");
                    Cookies.remove("token");
                    sessionStorage.removeItem("username");
                    sessionStorage.removeItem("userQrCodes");

                    navigate("/login");
                } else if (response.status === 404) {
                    toast.error("QR code not found");
                } else if (response.status === 500) {
                    toast.error("Something went wrong, please try again later");
                } else if (response.status == 429) {
                    toast.error("Too many requests, please try again later");
                }
                throw new Error("QR code deletion failed: " + response.status);
            }

            toast.success("QR code deleted successfully");
            navigate("/dashboard");


        } catch (error) {
            toast.error("Can't delete QR code, try again later");
        } finally{
            setDeleteLoading(false);
        }
    }

    const handleDownloadQr = () => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${qr.qrcode}`;
        link.download = `${qr.name || "qr_code"}.png`; //filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloaded");
    };




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
                        <div className="page-heading">QR Codes</div>
                    </div>

                    <div className="editqr-container">
                        <EditQrCard
                            qr={qr}
                            qrname={qrname}
                            redirectUrl={redirectUrl}
                            onQrnameChange={handleQrnameChange}
                            onRedirectUrlChange={handleRedirectUrlChange}
                            onDeleteQr={handleDeleteQr}
                            onSaveChanges={handleSaveChanges}
                            onDownloadQr={handleDownloadQr}
                            onAnalytics={handleAnalytics}
                            saveLoading={saveLoading}
                            deleteLoading={deleteLoading}
                        />
                    </div>

                </div>

            </div>
        </>
    )
}

export default Editqr
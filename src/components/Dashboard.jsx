import React, { useEffect, useState, useLayoutEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import '../styles/Dashboard.css'
import Navbar2 from "./Navbar2"
import toast from "react-hot-toast"
import Cookies from "js-cookie";


const Dashboard = () => {

    const navigate = useNavigate();

    const [userQrCodes, setUserQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    useEffect(() => {
        const savedIsLogin = sessionStorage.getItem("isLogin");
        const savedToken = Cookies.get("token");

        if (savedIsLogin && savedToken) {
            fetchUserQr();
        } else {
            navigate("/login");
        }
    }, [navigate])


    const fetchUserQr = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/allqr`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired");

                    sessionStorage.removeItem("isLogin");
                    Cookies.remove("token");
                    sessionStorage.removeItem("username");
                    sessionStorage.removeItem("userQrCodes");

                    navigate("/login");
                } else if (response.status === 500) {
                    toast.error("Something went wrong. Try again later");
                    navigate("/dashboard");
                } else if (response.status === 429) {
                    toast.error("Too many requests, please try again later");
                }
                throw new Error("Failed to fetch user QR");
            }

            const userQr = await response.json();

            const userQrCodes = userQr.map((qr) => ({
                id: qr.id,
                name: qr.name,
                shortId: qr.shortId,
                redirectUrl: qr.redirectUrl,
                qrcode: qr.qrcode,
                foreground: qr.foreground,
                background: qr.background,
                scans: qr.scansLogs.length,
                scansLogs: qr.scansLogs
            }))

            setUserQrCodes(userQrCodes);
            sessionStorage.setItem("userQrCodes", JSON.stringify(userQrCodes));

        } catch (error) {
            // console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const handleEdit = (qrid) => {
        navigate(`/editqr/${qrid}`);
    };

    const handleAnalytics = (qrid) => {
        navigate(`/analytics/${qrid}`);
    };

    const handleCreate = () => {
        navigate("/createnew");
    }

    const QrCard = ({ qr }) => {

        const imageSrc = `data:image/png;base64,${qr.qrcode}`;

        return (
            <div className="qr-card">
                <div className="qr-card-left">
                    <div className="qr-image">
                        <img src={imageSrc} height={130} />
                    </div>
                    <div className="qr-details-dashboard">
                        <div className="qr-name">{qr.name}</div>
                        <div className="qr-info">
                            <div className="qr-redirect">
                                <span className="redirect-heading">Redirects to:</span>
                                <span className="redirect-url">{qr.redirectUrl}</span>
                            </div>
                            <div className="qr-scans-count">
                                <span className="scans-count-heading">Total scans: </span>
                                <span className="scan-count">{qr.scans}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="qr-action-buttons">
                    <button className="qr-action-button-analytics" onClick={() => handleAnalytics(qr.shortId)}>Analytics</button>
                    <button className="qr-action-button-edit" onClick={() => handleEdit(qr.shortId)}>Edit</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-container">
                <Navbar2 name={sessionStorage.getItem("username")} />

                <div className="qr-codes-outer-container">
                    <div className="heading">
                        <div className="qr-codes-heading">QR Codes</div>
                        <div className="new-qr">
                            <button className="new-qr-button" onClick={handleCreate}>Create QR code</button>
                        </div>
                    </div>

                    <div className="qr-container">
                        {loading ? (
                            <div className="loader"></div>   // Show loading while fetching
                        ) : userQrCodes.length > 0 ? (
                            [...userQrCodes].reverse().map((qr) => <QrCard key={qr.id} qr={qr} />)
                        ) : (
                            <div className="no-qr-found">No QR codes found</div> // Show this only when data is empty
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard

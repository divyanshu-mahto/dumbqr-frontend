import React, { useEffect, useState, PureComponent } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analytics.css'
import Navbar2 from "./Navbar2";
import Cookies from "js-cookie";
import { useLayoutEffect } from "react";

const Graph = React.memo(({ data, dataKey }) => {

    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <LineChart data={data} margin={{ top: 20 }} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={dataKey} padding={{ left: 30, right: 30 }} style={{ fontSize: '12px', fontFamily: "Basier Square Mono", }} />
                <YAxis style={{ fontSize: '12px', fontFamily: "Basier Square Mono", }} />
                <Tooltip wrapperStyle={{ fontSize: '12px', fontFamily: "Basier Square Mono", }} />
                <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#21B400"
                    activeDot={{ r: 8 }}
                ></Line>
            </LineChart>
        </ResponsiveContainer>
    );
})

const ScanLocations = React.memo(({ data }) => {

    return (
        <>
            {Object.entries(data).length > 0 ? (
                Object.entries(data).map(([location, count]) => (
                    <div key={location} className="scan-country">
                        <div className="scan-country-name">{location}</div>
                        <div className="scan-country-value">{count}</div>
                    </div>
                ))
            ) : (
                <>
                    <div className="no-scans-found">
                        <div className="no-scans-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                <g clipPath="url(#clip0_184_1237)">
                                    <path d="M3.16602 5.54163V4.74996C3.16602 4.33003 3.33283 3.92731 3.62976 3.63037C3.9267 3.33344 4.32942 3.16663 4.74935 3.16663H6.33268" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.16602 13.4584V14.25C3.16602 14.67 3.33283 15.0727 3.62976 15.3696C3.9267 15.6666 4.32942 15.8334 4.74935 15.8334H6.33268" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12.666 3.16663H14.2493C14.6693 3.16663 15.072 3.33344 15.3689 3.63037C15.6659 3.92731 15.8327 4.33003 15.8327 4.74996V5.54163" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12.666 15.8334H14.2493C14.6693 15.8334 15.072 15.6666 15.3689 15.3696C15.6659 15.0727 15.8327 14.67 15.8327 14.25V13.4584" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.95898 9.5H15.0423" stroke="black" stroke-width="1.20" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_184_1237">
                                        <rect width="19" height="19" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className="no-scans-text">No scans found</div>
                        <div className="no-scans-subtext">share your QR codes!</div>
                    </div>
                </>
            )}
        </>
    );
})

const Analytics = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [timePeriod, setTimePeriod] = useState("7");
    const [dataKey, setDataKey] = useState("date");
    const [location, setLocation] = useState("country");

    const userQrCodes = JSON.parse(sessionStorage.getItem("userQrCodes")) || [];
    const selectedQr = userQrCodes.find(qr => qr.shortId === id);

    const loc = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [loc.pathname]);

    useEffect(() => {
        const savedIsLogin = Cookies.get("isLogin");
        const savedToken = Cookies.get("token");

        if (!savedIsLogin && !savedToken) {
            navigate("/login");
        }

    }, [navigate])

    const groupScansByDate = (data) => {
        const scanCounts = {};
        data.forEach(({ timestamp }) => {
            const date = new Date(timestamp).toISOString().split('T')[0];
            scanCounts[date] = (scanCounts[date] || 0) + 1;
        });
        return scanCounts;
    };

    const groupScansByLocation = (data, category) => {
        const scanCounts = {};

        data.forEach((log) => {
            const key = log[category]; // Dynamically get country, state, or city
            if (key) {
                scanCounts[key] = (scanCounts[key] || 0) + 1;
            }
        });

        return Object.fromEntries(
            Object.entries(scanCounts).sort((a, b) => b[1] - a[1]) // Sort descending
        );
    }


    const getScansInRange = (scanCounts, days) => {
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        let totalScans = 0;

        Object.keys(scanCounts).forEach(date => {
            const scanDate = new Date(date);
            if (scanDate >= startDate && scanDate <= today) {
                totalScans += scanCounts[date];
            }
        });

        return totalScans;
    };

    const fillMissingDates = (scanCounts, days, format) => {
        const result = [];
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        if (format === 'weekly') {
            let currentWeekStart = new Date(startDate);
            while (currentWeekStart <= today) {
                let currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

                let weekLabel = `${currentWeekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}-${currentWeekEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
                let scans = 0;

                for (let d = new Date(currentWeekStart); d <= currentWeekEnd && d <= today; d.setDate(d.getDate() + 1)) {
                    let dateStr = d.toISOString().split('T')[0];
                    scans += scanCounts[dateStr] || 0;
                }

                result.push({ week: weekLabel, scans });
                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            }
        } else {
            for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
                let dateStr = d.toISOString().split('T')[0];
                result.push({ date: dateStr, scans: scanCounts[dateStr] || 0 });
            }
        }
        return result;
    };


    const scanCounts = groupScansByDate(selectedQr.scansLogs);


    const getGraphData = () => {
        switch (timePeriod) {
            case '30':
                return fillMissingDates(scanCounts, 30, 'daily');
            case '90':
                return fillMissingDates(scanCounts, 90, 'weekly');
            default:
                return fillMissingDates(scanCounts, 7, 'daily');
        }
    };

    const graphData = getGraphData();
    const locationData = groupScansByLocation(selectedQr.scansLogs, location);

    return (
        <>
            <div className="container">
                <Navbar2 name={Cookies.get("username")} />
                <div className="outer-container">
                    <div className="navigate-back">
                        <div className="back-icon" onClick={() => navigate('/dashboard')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12" fill="none">
                                <path d="M0.936467 5.46967C0.643574 5.76256 0.643574 6.23744 0.936467 6.53033L5.70944 11.3033C6.00233 11.5962 6.4772 11.5962 6.7701 11.3033C7.06299 11.0104 7.06299 10.5355 6.7701 10.2426L2.52746 6L6.7701 1.75736C7.06299 1.46447 7.06299 0.989592 6.7701 0.696699C6.4772 0.403806 6.00233 0.403806 5.70944 0.696699L0.936467 5.46967ZM1.4668 6.75L23.5752 6.75L23.5752 5.25L1.4668 5.25L1.4668 6.75Z" fill="black" />
                            </svg>
                        </div>
                        <div className="page-heading">Analytics</div>
                    </div>

                    <div className="qr-analytics-container">
                        <div className="analytics-info">
                            <div className="analytics-item">
                                <div className="analytics-item-label">QR code</div>
                                <div className="analytics-item-value">{selectedQr.name}</div>
                            </div>
                            <div className="analytics-item">
                                <div className="analytics-item-label">Scans last {timePeriod} days</div>
                                <div className="analytics-item-value">{getScansInRange(scanCounts, timePeriod)}</div>
                            </div>
                            <div className="analytics-item">
                                <div className="analytics-item-label">Lifetime scans</div>
                                <div className="analytics-item-value">{selectedQr.scans}</div>
                            </div>
                        </div>
                        <div className="analytics-graph">
                            <div className="graph-heading">
                                <div className="days-buttons">
                                    <button className={`days-button-1 ${timePeriod === '7' ? 'active' : ''}`} onClick={() => { setTimePeriod('7'); setDataKey('date'); }}>Last 7 days</button>
                                    <button className={`days-button-1 ${timePeriod === '30' ? 'active' : ''}`} onClick={() => { setTimePeriod('30'); setDataKey('date'); }}>Last 30 days</button>
                                    <button className={`days-button-1 ${timePeriod === '90' ? 'active' : ''}`} onClick={() => { setTimePeriod('90'); setDataKey('week'); }}>Last 3 months</button>
                                </div>
                            </div>
                            <Graph
                                data={graphData}
                                dataKey={dataKey}
                            />
                        </div>

                        <div className="scans-per-location">
                            <div className="scans-location-choice">
                                <div className="scans-location-heading">Scans per</div>
                                <div className="scans-location-buttons">
                                    <button className={`scans-location-button-1 ${location === 'country' ? 'active' : ''}`} onClick={() => { setLocation('country'); }}>country</button>
                                    <button className={`scans-location-button-1 ${location === 'state' ? 'active' : ''}`} onClick={() => { setLocation('state'); }}>state</button>
                                    <button className={`scans-location-button-1 ${location === 'city' ? 'active' : ''}`} onClick={() => { setLocation('city'); }}>city</button>
                                </div>
                            </div>

                            <ScanLocations data={locationData} />
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default Analytics
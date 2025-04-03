import React, {useLayoutEffect} from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar2 from "./Navbar2";
import '../styles/Home.css';

const NotFoundErrorPage = () => {

    //scroll to top
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    return (
        <>
            <div className="home-container">
                <Navbar2 />

                <div className="container-1">
                    <div className="heading-2">Sorry, the page you're looking for cannot be found</div>
                    <Link to={"/"} className="start-button">Go back to Home</Link>
                    <div className="subheading-1">If you have scanned a QR code and reached here,<br/> the redirect link is invalid or does not exist</div>
                </div>
                
                <div className="footer">
                    <div className="footer-elements">
                        <div className="github">
                            <div className="github-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <g clipPath="url(#clip0_218_1418)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0019 0C4.48125 0 0.00500488 4.47625 0.00500488 9.99813C0.00500488 14.415 2.86875 18.1625 6.8425 19.485C7.3425 19.5763 7.5 19.28 7.5 19.015C7.5 18.7775 7.505 18.1138 7.5 17.2794C4.71938 17.8837 4.14313 15.9625 4.14313 15.9625C3.68876 14.8075 3.03376 14.5 3.03376 14.5C2.12626 13.88 3.10188 13.8919 3.10188 13.8919C4.105 13.9625 4.63375 14.9225 4.63375 14.9225C5.52563 16.4494 6.97313 16.0081 7.5425 15.7531C7.63375 15.1069 7.8925 14.6663 8.17813 14.4163C5.95813 14.1637 3.62438 13.3062 3.62438 9.475C3.62438 8.38313 4.01375 7.49125 4.65313 6.7925C4.55 6.54 4.20625 5.52312 4.75126 4.14625C4.75126 4.14625 5.59063 3.8775 7.5 5.17188C8.2975 4.95 9.15313 4.83938 10.0031 4.83563C10.8525 4.83938 11.7075 4.95 12.5063 5.17188C14.4156 3.87812 15.2538 4.14625 15.2538 4.14625C15.7988 5.52312 15.4556 6.54 15.3531 6.7925C15.9925 7.49125 16.3806 8.38313 16.3806 9.475C16.3806 13.3162 14.0431 14.1613 11.8156 14.4081C12.1744 14.7175 12.5 15.3175 12.5 16.25C12.5 17.5 12.5 18.6887 12.5 19.0175C12.5 19.285 12.6613 19.5806 13.1688 19.4837C17.1388 18.1594 20 14.4137 20 9.99813C20 4.47625 15.5238 0 10.0019 0Z" fill="#181616" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_218_1418">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <Link to={"https://github.com/divyanshu-mahto/dumbqr"} className="github-link">suggest a feature</Link>
                        </div>
                        <Link to={"mailto:divyanshukm18@gmail.com"} className="contact">contact support</Link>
                    </div>
                </div>
            </div>
        </>
    );

}

export default NotFoundErrorPage;
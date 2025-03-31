import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import '../styles/Navbar2.css';

const Navbar2 = (props) => {

  const [loggedIn, setLoggedIn] = useState(!!props.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if(sessionStorage.getItem("isLogin")){

        sessionStorage.removeItem("isLogin");
        Cookies.remove("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userQrCodes");

        toast.success("Logged out");
        navigate("/");
    } else{
        navigate("/");
    }
  }

  useEffect(() => {
    const handleResize = () => {
      // Close menu if screen width goes above 950px
      if (!loggedIn && window.innerWidth > 950) {
        setMenuOpen(false);
      }
    };

    handleResize();
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loggedIn]);

  return (
      <div className='navbar-desktop'>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
        </style>

          {loggedIn ?
          <>
            <div className='navbar-top'>
              <Link to={"/dashboard"} className={`navbar-left ${menuOpen ? 'menu-open' : ''}`} >DumbQR.xyz</Link>
              <div className='navbar-right'>
                <Link className='profile-button-large'>{props.name}</Link>
                <div className='hamburger-menu-closed' onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M6 18L18 6" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="4" viewBox="0 0 24 3" fill="none">
                          <path d="M2 1.5H22" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="4" viewBox="0 0 24 3" fill="none">
                          <path d="M2 1.5H22" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="4" viewBox="0 0 24 3" fill="none">
                          <path d="M2 1.5H22" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                      </>
                    )}
                </div>
              </div>
            </div>

            {menuOpen && (
              <div className='navbar-menu'>
                <Link className='navbar-menu-item-profile-small'>{props.name}</Link>
                <button onClick={handleLogout} className='navbar-menu-item'>Logout</button>
              </div>
            )}
          </> : 
          <>
            <div className='navbar-top'>
              <Link to={"/"} className={`navbar-left ${menuOpen ? 'menu-open' : ''}`}>DumbQR.xyz</Link>
              <div className='navbar-right'>
                <Link to={"/login"} className='login-button'>Login</Link>
                <Link to={"/signup"} className='signup-button'>Signup</Link> 
                <div className='hamburger-menu-closed-small' onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6L18 18M6 18L18 6" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="4" viewBox="0 0 24 3" fill="none">
                        <path d="M2 1.5H22" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="4" viewBox="0 0 24 3" fill="none">
                        <path d="M2 1.5H22" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="4" viewBox="0 0 24 3" fill="none">
                        <path d="M2 1.5H22" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </>
                  )}
                </div>
              </div>
            </div>

            {menuOpen && (
              <div className='navbar-menu'>
                <Link to='/signup' className='navbar-menu-item' onClick={() => setMenuOpen(false)}>Signup</Link>
                <Link to='/login' className='navbar-menu-item' onClick={() => setMenuOpen(false)}>Login</Link>
              </div>
            )}
          </>
          }    
      </div>
  )
}

export default Navbar2
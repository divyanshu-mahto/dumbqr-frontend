import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const [toastPosition, setToastPosition] = useState("top-center");

  useEffect(() => {
    const updateToastPosition = () => {
      if (window.innerWidth > 950) {
        setToastPosition("top-right");
      } else {
        setToastPosition("top-center");
      }
    };

    updateToastPosition();
    window.addEventListener("resize", updateToastPosition);
    return () => window.removeEventListener("resize", updateToastPosition);
  }, []);

  return (
    <>
      <Toaster
        position={toastPosition}
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              border: "1px solid #60c117",
              padding: "16px",
              color: "#60c117",
              backgroundColor: "#f6f6f6",
              fontFamily: "Basier Square Mono",
            },
            iconTheme: {
              primary: "#60c117",
              secondary: "#FFFAEE",
            },
          },
          error: {
            style: {
              border: "1px solid #d91907",
              padding: "16px",
              color: "#d91907",
              backgroundColor: "#f6f6f6",
              fontFamily: "Basier Square Mono",
            },
            iconTheme: {
              primary: "#d91907",
              secondary: "#FFFAEE",
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default Layout;

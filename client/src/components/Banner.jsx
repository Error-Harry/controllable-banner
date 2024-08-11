import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Banner = ({ changeVal }) => {
  const [bannerData, setBannerData] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/");
        const data = response.data[0];
        setBannerData(data);
        setIsVisible(data.is_visible);

        const targetTime = new Date(data.timer).getTime();
        const updateCountdown = () => {
          const now = new Date().getTime();
          const remainingTime = Math.max(
            0,
            Math.floor((targetTime - now) / 1000)
          );
          setCountdown(remainingTime);
        };

        updateCountdown();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(updateCountdown, 1000);
      } catch (error) {
        console.error("There was an error fetching the banner data", error);
      }
    };

    fetchData();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [changeVal, isVisible]);

  const handleCountdownClick = () => {
    if (bannerData.link) {
      window.location.href = bannerData.link;
    }
  };

  const handleToggleChange = () => {
    const newVisibility = isVisible ? 0 : 1;
    axios
      .post("http://localhost:8800/update-visibility", {
        is_visible: newVisibility,
      })
      .then((response) => {
        setBannerData((prev) => ({
          ...prev,
          is_visible: newVisibility,
        }));
        setIsVisible(newVisibility);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error updating visibility!", error);
      });
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    return `${days} Days ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const shouldShowBanner =
    (location.pathname === "/" &&
      bannerData.is_visible &&
      bannerData.admin_visibility &&
      countdown > 0) ||
    location.pathname === "/banner-dashboard";

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <div className="banner-container">
      {location.pathname === "/banner-dashboard" && (
        <div className="visibility-toggle">
          <label>Banner Visibility To User:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={handleToggleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
      <p className="banner-description">{bannerData.description}</p>
      <p className="banner-timer" onClick={handleCountdownClick}>
        Time remaining: {formatTime(countdown)}
      </p>
    </div>
  );
};

export default Banner;

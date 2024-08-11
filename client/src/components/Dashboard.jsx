import React, { useState } from "react";
import axios from "axios";
import Banner from "./Banner";

const Dashboard = () => {
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [changeVal, setChangeVal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTime = new Date(dateTime).getTime();
    const currentTime = new Date().getTime();

    if (isNaN(selectedTime)) {
      setError("Invalid date and time format.");
      return;
    }

    if (selectedTime <= currentTime) {
      setError("Please select a future date and time.");
      return;
    }

    axios
      .post("http://localhost:8800/internal-dashboard", {
        description,
        timer: dateTime,
        link,
      })
      .then((response) => {
        alert(response.data.message);
        setError("");
        setDescription("");
        setDateTime("");
        setLink("");
        setChangeVal(!changeVal);
      })
      .catch((error) => {
        console.error("There was an error updating the banner", error);
      });
  };

  return (
    <div className="center-div">
      <div className="banner-margin">
        <Banner changeVal={changeVal} />
      </div>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Banner Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Banner Time:</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Banner Link:</label>
          <input
            type="text"
            className="form-control"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="btn-submit" type="submit">
          Create Banner
        </button>
      </form>
    </div>
  );
};

export default Dashboard;

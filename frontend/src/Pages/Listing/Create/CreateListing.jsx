import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateListingForm from "./CreateListingForm";
import MapView from "./MapView";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    location: "",
    area: "",
    city: "",
    country: "",
    complaintType: "",
    complaintDescription: "",
  });

  const [query, setQuery] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: 23.8693275,
    lon: 90.3926893,
  });

  const [position, setPosition] = useState(null);
  const [predictionPending, setPredictionPending] = useState(false); // Track prediction status

  // Update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Trigger crime type prediction when complaint description changes
    if (name === "complaintDescription" && value.trim()) {
      generateCrimeType(value);
    }
  };

  // Predict crime type using AI API
  const generateCrimeType = async (text) => {
    setPredictionPending(true); // Start prediction
    try {
      const response = await axios.get(`http://localhost:8000/classify_crime/${encodeURIComponent(text)}`);
      const predictedType = response.data["Predicted Crime Type"];
      setFormData((prevData) => ({
        ...prevData,
        complaintType: predictedType,
      }));
      console.log("Predicted crime type:", predictedType);
    } catch (error) {
      console.error("Error predicting crime type:", error);
    } finally {
      setPredictionPending(false); // Prediction complete
    }
  };

  // Fetch latitude and longitude when location data changes
  useEffect(() => {
    if (query) {
      fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${query}&format=json&apiKey=f406d8d33f364287a7cac97270576411`
      )
        .then((response) => response.json())
        .then((result) => {
          const newCoordinates = {
            lat: result.results[0].lat,
            lon: result.results[0].lon,
          };
          setCoordinates(newCoordinates);
          setPosition(newCoordinates);
          console.log(newCoordinates);
        })
        .catch((error) => console.log("Error fetching coordinates:", error));
    }
  }, [query]);

  // Update query for Geoapify when formData changes
  useEffect(() => {
    if (formData.area && formData.location) {
      setQuery(
        `${formData.location}, ${formData.area}, ${formData.city}, ${formData.country}`
      );
    }
  }, [formData]);

  // Prevent submission until crime type is available
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.complaintType) {
      alert("Please wait for the crime type prediction.");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        lat: coordinates.lat,
        lon: coordinates.lon,
      };

      const response = await axios.post("http://localhost:3000/api/complaint", dataToSend);
      alert("Complaint reported successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Error reporting complaint!");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Side Form */}
      <div className="w-full">
        <CreateListingForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          predictionPending={predictionPending} // Pass prediction status
        />
      </div>

      {/* Right Side Map */}
      <div className="w-full h-[400px] lg:h-[800px]">
        <MapView coordinates={coordinates} position={position} setPosition={setPosition} />
      </div>
    </div>
  );
};

export default CreateListing;

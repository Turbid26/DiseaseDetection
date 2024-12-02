import React, { useState } from "react";
import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import "../new/1.css"; // Use a CSS file for the styles

const hf = new HfInference('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');

function Services() {
  const [modalActive, setModalActive] = useState(false);
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setMessage('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('username', localStorage.getItem('username'));

    try {
      setIsLoading(true);
      const response = await axios.post('./api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;

      setMessage('Image uploaded successfully!');

      // Call Hugging Face API for classification
      classifyImage(imageUrl);

    } catch (error) {
      setMessage('Error uploading image.');
      console.error('Upload error:', error.response ? error.response.data : error.message);
    }
  };

  // Classify image using Hugging Face Inference API
  const classifyImage = async (imageUrl) => {
    try {
      const result = await hf.imageClassification({
        data: imageUrl,  // Use the URL of the uploaded image
        model: 'nickmuchi/yolos-small-plant-disease-detection'
      });

      // Set the classification result from the Hugging Face API response
      setClassificationResult(result);
      setIsLoading(false);

    } catch (error) {
      setMessage('Error classifying image.');
      console.error('Classification error:', error.response ? error.response.data : error.message);
      setIsLoading(false);
    }
  };

  // Format and render classification results
  const renderClassificationResults = () => {
    if (!classificationResult || !Array.isArray(classificationResult)) return null;
  
    return classificationResult.map((result, index) => (
      <div key={index}>
        <p>Disease: {result.label}</p>
        <p>Accuracy: {result.score.toFixed(2)*100}%</p>
      </div>
    ));
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setModalActive(!modalActive);
  };

  };

  return (
    <div>
      {/* Navbar */}
      <nav>
        <h1>
          <span style={{ color: "#04BF94" }}>Agri</span>Diag
        </h1>
        <ul>
          <li>Home</li>
          <li>Services</li>
          <li>Blog</li>
          <li>History</li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="container">
        <div>
          <h1>Plant Problems Diagnosis,</h1>
          <h1>Identification & Preventing</h1>
          <p>
            We cannot allow your plants to suffer from disorders and various diseases.
            Let’s begin treatment with our plant disease identifier and easy in-app ID
            tool.
          </p>
          <button className="diagnose" onClick={toggleModal}>
            <i className="bx bxs-camera"></i>
            <span>Diagnose my plant</span>
          </button>
        </div>
        <div>
          <img
            src="Diseases_illustration_a772d9dc34.webp"
            alt="Diseases Illustration"
          />
        </div>
      </div>

      {/* Overlay and Modal */}
      {modalActive && (
        <>
          <div className="overlay" onClick={toggleModal}></div>
          <div className="modal">
            <h2>Diagnose Disease</h2>
            <p>Please upload a photo of the whole plant.</p>

            <div className="upload-container">
              {/* Upload box for Plant Photo */}
              <div className="upload-box">
                <i className="bx bx-upload"></i>
                {previewImage ? (
          <img src={previewImage} alt="Preview" style={styles.previewImage} />
        ) : (
          <div style={styles.placeholder}>
            <p>Select an image</p>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
        <button onClick={handleUpload} style={styles.button}>Upload Image</button>
              </div>

              
            </div>

            <div className="modal-footer">
              <button onClick={toggleModal}>Cancel</button>
              <button
                className={`primary ${plantPhoto ? "enabled" : ""}`}
                disabled={!plantPhoto}
              >
                Start Diagnostics
              </button>
              <div>{renderClassificationResults()}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );


export default Services;

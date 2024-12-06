import { useState } from 'react';

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: selectedFile.name,
      type: selectedFile.type,
    };

    try {
      const response = await fetch('http://localhost:5000/Gemini/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setAnalysisResult(result.analysis); // Set the analysis result to state
      } else {
        console.error('Error:', result);
        alert('Image upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the image.');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Upload an Image</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {preview && (
          <img src={preview} alt="Preview" className="mb-4 rounded-lg shadow-md" />
        )}
        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200">
          Upload
        </button>
      </form>

      {analysisResult && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Analysis Result:</h3>
          <p className="mt-2 text-gray-700">{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default UploadImage;

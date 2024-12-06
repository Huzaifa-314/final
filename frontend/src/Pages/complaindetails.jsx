import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/complaint/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setComplaint(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleCrimeAnalysis = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/analyze-crime/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to analyze crime');
      }

      const data = await res.json();
      const generatedText = data.content.candidates[0].content.parts[0].text || "No response available";
      alert(`Analysis complete: ${generatedText}`);

      // Assuming the score is part of the generatedText and can be parsed
      const score = parseInt(generatedText);
      console.log(score);
      if (score > 60) {
        const validationRes = await fetch(`http://localhost:3000/api/validate-crime`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(complaint), 
        });

        if (!validationRes.ok) {
          throw new Error('Failed to save crime data to validation database');
        }

        alert('Crime data successfully saved to validation database');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/complaint/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const updatedComplaint = await response.json();
      setComplaint(updatedComplaint);
      setNewComment({ name: "", email: "", comment: "" });
      alert("Comment added successfully");
    } catch (error) {
      alert("Error adding comment: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Complaint Details</h1>
      <div className="space-y-4">
        {/* Complaint Details */}
        <div className="text-lg">
          <span className="font-semibold text-gray-700">Location:</span> {complaint.location}
        </div>
        <div className="text-lg">
          <span className="font-semibold text-gray-700">Area:</span> {complaint.area}
        </div>
        <div className="text-lg">
          <span className="font-semibold text-gray-700">City:</span> {complaint.city}
        </div>
        <div className="text-lg">
          <span className="font-semibold text-gray-700">Country:</span> {complaint.country}
        </div>
        <div className="text-lg">
          <span className="font-semibold text-gray-700">Latitude:</span> {complaint.lat}
        </div>
        <div className="text-lg">
          <span className="font-semibold text-gray-700">Longitude:</span> {complaint.lon}
        </div>
        <div className="text-lg">
          <span className="font-semibold text-gray-700">Date:</span> {new Date(complaint.date).toLocaleString()}
        </div>

        {/* Additional Complaint Details */}
        {complaint.complaintType && (
          <div className="text-lg">
            <span className="font-semibold text-gray-700">Complaint Type:</span> {complaint.complaintType}
          </div>
        )}
        {complaint.complaintDescription && (
          <div className="text-lg">
            <span className="font-semibold text-gray-700">Description:</span> {complaint.complaintDescription}
          </div>
        )}
      </div>

      {/* Crime Analysis Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleCrimeAnalysis}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          Analyze Crime
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
        {complaint.comments && complaint.comments.length > 0 ? (
          complaint.comments.map((comment, index) => (
            <div key={index} className="mb-4">
              <div className="text-lg font-semibold">{comment.name} ({comment.email})</div>
              <div className="text-gray-700">{comment.comment}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No comments yet.</div>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mt-6 space-y-4">
        <h3 className="text-xl font-bold">Add a Comment</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={newComment.name}
          onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={newComment.email}
          onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Your Comment"
          value={newComment.comment}
          onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
          className="w-full p-2 border rounded"
        ></textarea>
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DetailsPage;

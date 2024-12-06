const CreateListingForm = ({ formData, handleChange, handleSubmit, predictionPending }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Location Field */}
      <div className="mb-4">
        <label className="block text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Area Field */}
      <div className="mb-4">
        <label className="block text-gray-700">Area</label>
        <input
          type="text"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* City Field */}
      <div className="mb-4">
        <label className="block text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Country Field */}
      <div className="mb-4">
        <label className="block text-gray-700">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Complaint Type Field (Read-Only) */}
      <div className="mb-4">
        <label className="block text-gray-700">Type of Complaint</label>
        <input
          type="text"
          name="complaintType"
          value={formData.complaintType}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* Complaint Description Field */}
      <div className="mb-4">
        <label className="block text-gray-700">Complaint Description</label>
        <textarea
          name="complaintDescription"
          value={formData.complaintDescription}
          onChange={handleChange}
          required
          rows="5"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your complaint in detail..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={predictionPending} // Disable button during prediction
        className={`w-full py-3 px-6 font-semibold rounded-md ${
          predictionPending ? "bg-gray-400 text-gray-800 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {predictionPending ? "Predicting..." : "Submit Complaint"}
      </button>
    </form>
  );
};

export default CreateListingForm;

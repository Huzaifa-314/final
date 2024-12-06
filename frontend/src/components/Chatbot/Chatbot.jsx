import { useState } from 'react';

const Chatbot = () => {
    const [prompt, setPrompt] = useState('');
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        if (!prompt.trim()) {
            setError('Prompt cannot be empty');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error('Failed to generate content');
            }

            const data = await res.json();


            const generatedText = data.content.candidates[0].content.parts[0].text || "No response available";

            setResponses((prevResponses) => [...prevResponses, generatedText]);
            setPrompt('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {

        localStorage.setItem('generatedResponses', JSON.stringify(responses));
        alert('Responses saved to local storage!');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 p-8">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                {error && <p className="text-red-500 text-center">{error}</p>}

                {responses.length > 0 && (
                    <div className="mt-4">
                        {responses.map((response, index) => (
                            <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-100 mb-4">
                                <h2 className="text-xl mb-2 font-semibold">Generated Content {index + 1}:</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
                            </div>
                        ))}
                    </div>
                )}
                {loading && (
                    <div className="flex items-center justify-center min-h-[100px]">
                        <span className="loading loading-dots loading-lg"></span>
                    </div>
                )}
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Gemini Content Generator</h1>
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                        placeholder="Enter Your Message..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </form>

                {responses.length > 0 && (
                    <button
                        onClick={handleSave}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 mt-4"
                    >
                        Save Responses
                    </button>
                )}
            </div>
        </div>
    );
};

export default Chatbot;

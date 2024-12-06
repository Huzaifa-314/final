import { useState, useEffect } from "react";
import axios from "axios";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

const Voice = () => {
    const [responseText, setResponseText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For loading state

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    

    useEffect(() => {
        // Speak initialization message when the component loads
        const initializationMessage = "Initializing Surokkha...Assalamu Alaikum, Ami surokkha";
        speak(initializationMessage);
    }, []);

    // Start listening
    const startListening = () => {
        setIsListening(true);
        recognition.start();
    };

    // Stop listening
    recognition.onend = () => {
        setIsListening(false);
    };

    // Handle recognition result
    recognition.onresult = async (event) => {
        const userMessage = event.results[0][0].transcript;
        console.log("User message:", userMessage);

        // Send to API
        try {
            setIsLoading(true); // Set loading state
            const response = await axios.post(
                "http://localhost:3000/api/generate-content",
                { prompt: userMessage }
            );
            console.log(response);
            const content =
                response?.data.content?.candidates[0]?.content?.parts?.[0]?.text ||
                "No response available";
            setResponseText(content);
            speak(content); // Speak the response
        } catch (error) {
            console.error("Error fetching API response:", error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Function to convert text to speech
    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1;
        speech.volume = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            {/* Top Image */}
            <img
                src="/giphy.gif"
                alt="Assistant Animation"
                className="w-72 h-72 mb-6"
            />
            <h1 className="text-3xl font-bold mb-6">Shurokkha</h1>
            <button
                onClick={startListening}
                disabled={isListening}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition ${
                    isListening
                        ? "bg-gray-500 cursor-not-allowed text-gray-200"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
                {isListening ? (
                    <>
                        <MicrophoneIcon className="h-6 w-6 mr-2 animate-pulse" />
                        Listening...
                    </>
                ) : (
                    <>
                        <MicrophoneIcon className="h-6 w-6 mr-2" />
                        Talk to Assistant
                    </>
                )}
            </button>
            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                ) : (
                    <p className="text-lg font-medium text-gray-300">
                        <strong className="text-blue-400">Response:</strong> {responseText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Voice;

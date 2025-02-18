import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageAvatar from "./assests/avatar_1687662732.png";

export default function App() {
  const [textValue, setTextValue] = useState("");
  const [audioData, setAudioData] = useState({ audio_id: "", message: "" });
  const [loading, setLoading] = useState(false); // Loading state

  const handlePost = async (e) => {
    e.preventDefault();

    if (textValue.length > 1000) {
      toast.error(
        `Sorry, the text length is greater than 1000 characters. Current length: ${textValue.length}`
      );
      return;
    }
    console.log(textValue);
    setLoading(true); // Start loading
    try {
      const payload = new URLSearchParams();
      payload.append("text", textValue);

      const response = await axios.post(
        "http://127.0.0.1:8000/text/to-spaceh",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setAudioData({
          audio_id: response.data.audio_id,
          message: response.data.message,
        });
        setTextValue("");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <>
      <main className="mx-auto max-w-[700px] py-8">
        <div className="card">
          <div>
            <img
              src={imageAvatar}
              className="w-10 h-10 rounded-full m-2"
              alt=""
            />
          </div>
          <div className="flex-center mb-3 gap-2 lg:gap-4">
            <div className="flex-1">
              <form onSubmit={handlePost}>
                <textarea
                  className="h-[200px] w-full rounded-md bg-lighterDark p-3 focus:outline-none"
                  name="post"
                  id="post"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="What's on your text"
                ></textarea>
                <button
                  className={`auth-input bg-purple-900 font-bold text-deepDark transition-all hover:opacity-90 mt-3 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {audioData.audio_id ? (
          <audio
            className="text-deepDark mt-10 w-64 mx-auto"
            src={`http://127.0.0.1:8000/audio/${audioData.audio_id}`}
            controls
          ></audio>
        ) : (
          loading && (
            <div className="mt-10 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span className="ml-2 text-indigo-500">Processing...</span>
            </div>
          )
        )}
      </main>

      <ToastContainer />
    </>
  );
}

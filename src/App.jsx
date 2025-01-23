import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [textValue, setTextValue] = useState("");
  const [audioData, setAudioData] = useState({ audio_id: "", message: "" });

  const handlePost = async (e) => {
    e.preventDefault();

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

        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <main className="mx-auto max-w-[700px] py-8">
        <div className="card">
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
                  className="auth-input bg-lwsGreen font-bold text-deepDark transition-all hover:opacity-90 mt-3"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        {audioData.audio_id && (
          <audio
            className="text-deepDark mt-10 w-64 mx-auto"
            src={`http://127.0.0.1:8000/audio/${audioData.audio_id}`}
            controls
          ></audio>
        )}
      </main>

      <ToastContainer />
    </>
  );
}

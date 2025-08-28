import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const api = `https://avatar.iran.liara.run/public/`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user"))
      navigate("/login");
  },[navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(
        localStorage.getItem("chat-app-user")
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      console.log(data);
      if (data.isSet) {
        user.isAvatarImgSet = true;
        user.avatarImg = data.image;
        localStorage.setItem(
           "chat-app-user",
          JSON.stringify(user)
        );
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
        
          const fetchData = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
              try {
                const idx = Math.floor(Math.random() * 100) + 1;
                const image = await axios.get(`${api}/${idx}.png}`, {
            responseType: 'arraybuffer'
          });
                const base64 = Buffer.from(image.data, 'binary').toString('base64');
                const dataUrl = `data:image/png;base64,${base64}`;
          
                data.push(dataUrl);
                console.log("image extracted")
              } catch (error) {
                if (error.response && error.response.status === 429) {
                  console.error("Too many requests. Please try again later.");
                } else {
                  console.error("An error occurred:", error.message);
                }
                break; // Exit the loop on error
              }
            }
              setAvatars(data);
              setIsLoading(false);
          }
        
          fetchData();
        },[api]);
  return (
    <>
      {isLoading ? (
        <div className="avatarContainer">
          <img src={loader} alt="loader" className="loader" />
        </div>
      ) : (
        <div className="avatarContainer">
          <div>
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    key={index}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="button">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
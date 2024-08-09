import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudget, SelectTravelList } from "@/constants/option";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { LiaTruckLoadingSolid } from "react-icons/lia";

const CreateTrip = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  const handleInputChange = (name, value) => {
    if (name === "destination") {
      const simplifiedPlace = {
        formatted_address: value.formatted_address,
        lat: value.geometry.location.lat(),
        lng: value.geometry.location.lng(),
      };
      setFormData({
        ...formData,
        [name]: simplifiedPlace,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const GenerateTrip = async () => {
    const { destination, noOfDays, budget, travel } = formData;

    if (!destination || !noOfDays || !budget || !travel) {
      return toast.error("Please fill in all the details");
    }

    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      destination?.formatted_address
    )
      .replace("{noOfDays}", noOfDays)
      .replace("{travel}", travel)
      .replace("{budget}", budget);

    console.log("FINAL_PROMPT: ", FINAL_PROMPT);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: FINAL_PROMPT,
              },
            ],
          },
        ],
      });

      console.log("Chat session started...");

      const result = await chatSession.sendMessage(FINAL_PROMPT);

      console.log("AI Response: ", result?.response?.text());

      if (result?.response?.text()) {
        setLoading(false);
        SaveAiTrip(result?.response?.text());
        toast.success("Trip generated successfully!");
      } else {
        throw new Error("No response from AI model");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    }
  };

  const SaveAiTrip = async (result) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: result,
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      GetUserProfile(tokenResponse);
    },
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        console.log("User profile: ", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        GenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const openAndMonitorWindow = (url) => {
    const popup = window.open(url);

    if (popup) {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          console.log("Popup window closed");
        }
      }, 500);
    } else {
      console.error("Failed to open popup window");
    }
  };

  return (
    <div className="container">
      <Toaster position="top-right" />
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-8 mt-10">
        <h2 className="font-bold text-3xl">What you have to do?</h2>
        <p className="text-gray-500">
          Just provide basic information, our trip planner helps you to find the
          best place. <br />
          We make sure that your journey will be full of JOY and Adventure.
        </p>
        <div className="mt-[30px]">
          <div>
            <h2 className="text-xl my-3 font-medium">Where you want to GO?</h2>
            <div className="mb-6">
              <GooglePlacesAutocomplete
                placeholder={"Enter the Location🌏"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                apiKey={apiKey}
                onPlaceSelected={(place) => {
                  setPlace(place);
                  handleInputChange("destination", place);
                }}
              />
            </div>
            <div>
              <h2 className="text-xl my-3 font-medium">
                For how many days are you planning?
              </h2>
              <Input
                placeholder={"Ex-5"}
                type="number"
                onChange={(e) => handleInputChange("noOfDays", e.target.value)}
              />
            </div>
            <div>
              <h2 className="text-xl my-3 font-medium">
                How much is your Budget?
              </h2>
              <div className="grid grid-cols-3 gap-5 mt-4">
                {SelectBudget.map((budget) => (
                  <div
                    key={budget.id}
                    className={`p-4 border rounded-lg justify-center align-center hover:shadow-lg ${
                      formData.budget === budget.title &&
                      "shadow-lg border-black"
                    }`}
                    onClick={() => handleInputChange("budget", budget.title)}
                  >
                    <img
                      src={budget.icon}
                      alt={budget.title}
                      className="w-12 h-12 object-cover text-4xl"
                    />
                    <h3 className="font-bold text-lg">{budget.title}</h3>
                    <p className="text-sm text-gray-500">
                      {budget.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl my-3 font-medium">
                You are Planning with Whom?
              </h2>
              <div className="grid grid-cols-3 gap-5 mt-4">
                {SelectTravelList.map((travel) => (
                  <div
                    key={travel.id}
                    className={`p-4 border rounded-lg justify-center align-center hover:shadow-lg ${
                      formData.travel === travel.title &&
                      "shadow-lg border-black"
                    }`}
                    onClick={() => handleInputChange("travel", travel.title)}
                  >
                    <img
                      src={travel.icon}
                      alt={travel.title}
                      className="w-10 h-10 object-cover text-2xl"
                    />
                    <h3 className="font-bold text-lg">{travel.title}</h3>
                    <p className="text-sm text-gray-500">
                      {travel.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 mb-16 flex justify-end">
          <Button disabled={loading} onClick={GenerateTrip}>
            {loading ? (
              <LiaTruckLoadingSolid className="h-7 w-7 animate-spin" />
            ) : (
              "Generate Trip!🗺️"
            )}
          </Button>
        </div>
        <ContextMenu>
          <ContextMenuTrigger></ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
            <ContextMenuItem>My Trips</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Almost Done!</DialogTitle>
            <DialogDescription>
              You must log in to continue. If you don't have an account, we will
              create a new account for you.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-[30px] flex justify-center">
            <FcGoogle
              onClick={() => {
                login();
              }}
              size={36}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                handleCloseDialog();
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;

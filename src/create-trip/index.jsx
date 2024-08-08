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
import axios, { isCancel, AxiosError } from "axios";

const CreateTrip = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const GenerateTrip = async () => {


    if (
      !formData?.destination ||
      !formData?.noOfDays ||
      !formData?.budget ||
      !formData?.travel
    ) {
      return toast.error("Please fill in all the details");
    }

      const user = localStorage.getItem("user");

        if (user) {
          
          return;
        }
        else{
          setOpenDialog(true);

        }

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.destination?.formatted_address
    )
      .replace("{noOfDays}", formData?.noOfDays)
      .replace("{travel}", formData?.travel)
      .replace("{budget}", formData?.budget)
      .replace("{noOfDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);

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

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
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
      console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(true);
      GenerateTrip();
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);

    });
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
          <Button onClick={GenerateTrip}>Generate Trip!🗺️</Button>
        </div>
        <ContextMenu>
          <ContextMenuTrigger></ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Download</ContextMenuItem>
            <DialogTrigger asChild>
              <ContextMenuItem onClick={handleOpenDialog}>
                Delete
              </ContextMenuItem>
            </DialogTrigger>
          </ContextMenuContent>
        </ContextMenu>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="">
                <div className="flex">
                  <img src="/logo.svg" alt="" className="" />
                  <div className="pl-3 text-justify text-lg">
                    Sign-In with Google
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                <p className="p-2 inline">
                  <span>
                    Sign in to the App with
                    <img src="/google.svg" alt="" className="h-[1.7rem]" />{" "}
                    OAuth Security
                  </span>
                </p>
                <Button
                  type="submit"
                  className="w-full mt-3"
                  onClick={() => login()}
                >
                  <FcGoogle className="h-7 w-5" />
                  Sign In with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button onClick={handleCloseDialog} aria-label="Close">
                &times;
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateTrip;

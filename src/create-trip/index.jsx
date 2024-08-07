import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { SelectBudget, SelectTravelList } from "@/constants/option";
import { Button } from "@/components/ui/button";
const CreateTrip = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [place, setPlace] = useState(null);

  return (
    <div className="container">
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-8 mt-10">
        <h2 className="font-bold text-3xl">What you have to do ?</h2>
        <p className="text-gray-500">
          Just provide basic information, our trip planner help you to find the
          best place. <br />
          We make sure that your journey will be full of JOY, Adventure,
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
                  console.log(place);
                }}
              />
            </div>
            <div>
              <h2 className="text-xl my-3 font-medium">
                For how many days you are planning?
              </h2>
              <Input placeholder={"Ex-5"} type="number" />
            </div>
            <div>
              <h2 className="text-xl my-3 font-medium">
                How much is your Budget?
              </h2>
              <div className="grid grid-cols-3 gap-5 mt-4">
                {SelectBudget.map((budget) => (
                  <div
                    key={budget.id}
                    className="p-4 border rounded-lg justify-center align-center  hover:shadow-lg "
                  >
                    <img
                      src={budget.icon}
                      alt={budget.title}
                      className="w-12 h-12 object-cover text-4xl "
                    />
                    <h3 className="font-bold text-lg">{budget.title}</h3>
                    <p className="text-sm text-gray-500">
                      {budget.description}
                    </p>
                  </div>
                ))}
              </div>
              <h2 className="text-xl my-3 font-medium">
                You are Planning with Whom?
              </h2>
              <div className="grid grid-cols-3 gap-5 mt-4">
                {SelectTravelList.map((budget) => (
                  <div
                    key={budget.id}
                    className="p-4 border rounded-lg justify-center align-center  hover:shadow-lg "
                  >
                    <img
                      src={budget.icon}
                      alt={budget.title}
                      className="w-10 h-10 object-cover text-2xl "
                    />
                    <h3 className="font-bold text-lg">{budget.title}</h3>
                    <p className="text-sm text-gray-500">
                      {budget.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4  mb-16 flex justify-end">
          <Button>Generate Trip!🗺️</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;

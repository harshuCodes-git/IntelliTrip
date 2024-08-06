import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from '../ui/button';
// import Link from "next/link";
const Hero = () => {
  return (
    <div>
      <div className=" flex items-center mx-56 gap-9 text-center mt-[30px] ">
        <h1 className="font-extrabold text-[48px]">
          Come and Generate the new idea of a{" "}
          <span className="text-orange-600 font-sans">Adventure</span>
        </h1>
      </div>
      <div className="flex items-center mx-[450px]  gap-9 text-center ">
        <p className="font-[10px]">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem qui
          voluptatum quos similique dignissimos dolore
        </p>
      </div>
      <div className=" flex p-2 justify-center items-center">
        <Link to={"/create-trip"}>
          <Button>Lets Get Started.</Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero

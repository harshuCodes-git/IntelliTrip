import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import NavigationMenu from "./custom/NavigationBar";
const Header = () => {
  return (
    <div className="p-2  flex shadow-50 justify-between items-center  ">
      <img src="/logo.svg" alt="" />
      <div className=" flex justify-center">
        <NavigationMenu>
          <h2 className="font-semibold  from-orange-500 text-[25px]">
            AI Travel Plan
          </h2>
        </NavigationMenu>
      </div>
      <div className="space-x-1">
        <Button>Sign Up</Button>
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default Header;

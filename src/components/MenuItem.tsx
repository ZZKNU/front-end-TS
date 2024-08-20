import React from "react";
import { MenuItemProp } from "types/type";

const MenuItem: React.FC<MenuItemProp> = ({ icon, text, onClick }) => (
  <div
    className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    {icon}
    <span className="ml-4">{text}</span>
  </div>
);

export default MenuItem;

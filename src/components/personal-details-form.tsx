import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const PersonalDetalsForm = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="col-span-1">
        <Label>First Name</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-1">
        <Label>Last Name</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-2">
        <Label>Phone Number</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-2">
        <Label>Email</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-2">
        <Label>NIN Number</Label>
        <Input placeholder="" />
      </div>
    </div>
  );
};

export default PersonalDetalsForm;

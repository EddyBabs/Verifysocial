import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const BuisnessDetailsForm = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="col-span-2">
        <Label>Buisness Name</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-2">
        <Label>Whats your buisness about?</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-1">
        <Label>Select social platform</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-1">
        <Label>URL</Label>
        <Input placeholder="" />
      </div>

      <div className="col-span-2">
        <Button>Add New Social Profile</Button>
      </div>
    </div>
  );
};

export default BuisnessDetailsForm;

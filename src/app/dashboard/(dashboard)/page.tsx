import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Vendor</h1>
        <div>
          <Input placeholder="Search by name" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-4">
            <h1>Glow by Banks</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h1 className="font-semibold">
              Will you like to patronize this vendor?
            </h1>
            <p>
              Click on any of the social media platform to contact Glow by Banks
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="p-4">
            <h1>Reviews</h1>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

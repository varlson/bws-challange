import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <p>Dashboard page</p>
      <Button variant="contained">Contained</Button>

      <div className="bg-white p-14">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, delectus
          voluptatibus optio in a fugiat quod. Temporibus, adipisci recusandae
          tempora dolor obcaecati voluptate minima architecto alias aut expedita
          in labore.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;

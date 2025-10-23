import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { GetMe } from "../../services/users/users.services";

function Dashboard() {
  const listMe = async () => {
    const response = await GetMe();
    console.log(response);
  };
  return (
    <div>
      <p>Dashboard page</p>
      <Button variant="contained">Contained</Button>

      <Button
        variant="contained"
        onClick={() => {
          console.log(document.cookie);
        }}
      >
        token
      </Button>

      <div className="bg-white p-14">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, delectus
          voluptatibus optio in a fugiat quod. Temporibus, adipisci recusandae
          tempora dolor obcaecati voluptate minima architecto alias aut expedita
          in labore.
        </p>

        <button onClick={listMe}>setValue</button>
      </div>
    </div>
  );
}

export default Dashboard;

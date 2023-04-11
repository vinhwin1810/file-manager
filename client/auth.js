import { React, useState, useEffect } from "react";

export const getData = () => {
  //make a get request to the server at any listed route
  const [data, setData] = useState({});

  //data
  const formInfo = {
    username: "Bill123",
    password: "mypassword",
  };

  //get
  useEffect(() => {
    fetch("/home") //return a promise
      .then((res) => res.json()) //allow to handle data like JS object and send data down to the client-side
      .then((data) => setData);
  }, []);

  //post: need a body that supplies the data (body-parser in back-end)
  useEffect(() => {
    fetch("/home", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formInfo),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <>
      <div>{data.name}</div>
      <div>{data.age}</div>
    </>
  );
};

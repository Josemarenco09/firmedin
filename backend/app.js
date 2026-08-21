import express from "express";

const app = express();
const puerto = 3000;

app.get("/", (req, res) => {
  console.log("estoy");
  res.send("hola, cotorrita");
});

app.listen(puerto, () => {
  console.log("Escucha puerto https://www.localhost:", puerto);
});

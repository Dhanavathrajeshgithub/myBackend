import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [jokes, setJokes] = useState([]);
  useEffect(() => {
    axios
      .get("/jokes")
      .then((response) => {
        setJokes((prev) => [...prev, response.data]);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <h1>MERN Stack </h1>
      <p>Jokes: {jokes.length}</p>
      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>SetUp: {joke.setup}</h3>
          <p>Delivery: {joke.delivery}</p>
        </div>
      ))}
    </>
  );
}

export default App;

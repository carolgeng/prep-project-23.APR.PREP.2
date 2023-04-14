import { useEffect, useState } from "react";
import "./App.css";
import logo from "./mlh-prep.png";
import AutoComp from "./components/AutoComp";
import { useLoadScript } from "@react-google-maps/api";
import React from 'react';

function App() {
  const [error, setError] = useState(null);
  const [isVarLoaded, setIsVarLoaded] = useState(false);
  const [city, setCity] = useState("Your location");
  const [results, setResults] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (city == "Your location") {
      navigator.geolocation.getCurrentPosition((position) => {
          console.log("you are here", position)
          let coordX = position.coords.latitude
          let coordY = position.coords.longitude
          console.log(coordX, coordY)
          fetch(
            "http://api.openweathermap.org/geo/1.0/reverse?lat="
            + coordX + "&lon=" + coordY +
            "&appid=" +
            process.env.REACT_APP_APIKEY
          ).then((res) =>
          {return res.json()}).then((result)=> {
            console.log(result);
            console.log("city:", result[0].name)
            setCity(result[0].name);
          })
        }, (err) => {
            console.log("Error:")
            console.log(err)
        });
    }
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=metric" +
      "&appid=" +
      process.env.REACT_APP_APIKEY
    ) 
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsVarLoaded(false);
          } else {
            setIsVarLoaded(true);
            setResults(result);
          }
        },
        (error) => {
          setIsVarLoaded(true);
          setError(error);
        }
      );
  }, [city]);


  const cityHandler = (city) => {
    console.log("City set to:", city);
    setCity(city);
  };
  
  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo"></img>
        <div>
          <h2>Enter a city below 👇</h2>
          {isLoaded && <AutoComp cityHandler={cityHandler}></AutoComp>}
          <div className="Results">
            {!isVarLoaded && <h2>Loading...</h2>}
            {console.log(results)}
            {console.log(isLoaded)}
            {isVarLoaded && results && (
              <>
                <h3>{results.weather[0].main}</h3>
                <p>Feels like {results.main.feels_like}°C</p>
                <i>
                  <p>
                    {results.name}, {results.sys.country}
                  </p>
                </i>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;

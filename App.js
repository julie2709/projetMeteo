import { useState, useEffect } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "./components/Loader";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);
  const [temp, setTemp] = useState(null);
  const [desc, setDesc] = useState(null);
  const [icon, setIcon] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = "743f2bb5eda305630fcd134141ea8e02";

  useEffect(() => {
    async function getCurrentLocationAndWeather() {
      try {
        // Demander la permission de localisation
        const permissionResponse =
          await Location.requestForegroundPermissionsAsync();
        if (!permissionResponse || permissionResponse.status !== "granted") {
          setErrorMsg("Permission d'accès à la localisation refusée");
          return;
        }

        // Récupérer la position actuelle
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        // console.log(`valeur de latitude : ${latitude}`);
        // console.log(`valeur de longitude : ${longitude}`);

        // Appeler l'API OpenWeatherMap pour la météo actuelle
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`
        );
        if (!weatherResponse.ok) {
          throw new Error("Erreur lors de la récupération des données météo");
        }
        const weatherData = await weatherResponse.json();
        setCity(weatherData.name);
        setTemp(weatherData.main.temp);
        setDesc(weatherData.weather[0].description);
        setIcon(
          `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        );

        // Appeler l'API pour les prévisions sur 5 jours
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`
        );
        if (!forecastResponse.ok) {
          throw new Error(
            "Erreur lors de la récupération des prévisions météo"
          );
        }
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.list.slice(0, 40)); // 40 créneaux pour 5 jours
      } catch (error) {
        setErrorMsg(`Erreur : ${error.message}`);
      }
    }

    getCurrentLocationAndWeather();
  }, []);

  // Fonction pour regrouper les prévisions par jour
  const groupByDay = (forecastData) => {
    //console.log('groupByDay called with:', forecastData); // Débogage
    const days = [];
    let currentDay = null;
    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (day !== currentDay) {
        currentDay = day;
        days.push({ day, forecasts: [] });
      }
      days[days.length - 1].forecasts.push({
        time: date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: item.main.temp,
        desc: item.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      });
    });
    return days;
  };

  const groupedForecast = forecast.length > 0 ? groupByDay(forecast) : [];

  return (
    <LinearGradient
      colors={["#4facfe", "#00f2fe"]} // Dégradé bleu vif
      style={styles.container}
    >
      {(!location || !city || !temp || !desc) && !errorMsg ? (
        <Loader />
      ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <CurrentWeather city={city} temp={temp} desc={desc} icon={icon} />
          <Forecast groupedForecast={groupedForecast} />
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4facfe", // Fallback si LinearGradient échoue
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
    margin: 20,
    fontWeight: "600",
  },
});

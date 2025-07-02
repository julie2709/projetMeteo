import { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);
  const [temp, setTemp] = useState(null);
  const [desc, setDesc] = useState(null);
  const [icon, setIcon] = useState(null);

  const API_Key = "743f2bb5eda305630fcd134141ea8e02";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_Key}`;

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        // Supprimer la vérification Device.isDevice si tu testes sur un appareil physique
        if (Platform.OS === "android") {
          const { isDevice } = await import("expo-device");
          if (!isDevice) {
            setErrorMsg(
              "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
            );
            return;
          }
        }

        // Demander la permission de localisation sans destructuration directe
        const permissionResponse =
          await Location.requestForegroundPermissionsAsync();
        if (!permissionResponse || permissionResponse.status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        // Récupérer la position actuelle
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        //stocker les données de l'API dans des variables

        // Appeler l'API OpenWeatherMap pour les données météo
        const weatherResponse = await fetch(`${url}`);
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
      } catch (error) {
        setErrorMsg(
          "Erreur lors de la récupération de la localisation : " + error.message
        );
      }

      //stocker les données de l'API dans des variables
    }

    getCurrentLocation();
  }, []);

  let text = "Waiting...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location && location.coords) {
    text =
      `Ville: ${city || "Chargement"}\n` +
      `Température: ${temp}°C\n` +
      `descrition Temps: ${desc}`;
  }

  return (
    <LinearGradient
      colors={["#4facfe", "#00f2fe"]} // Dégradé bleu vif
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.weatherContainer}>
          <Text style={styles.cityText}>Ville: {city}</Text>
          <Text style={styles.tempText}>Température: {temp}°C</Text>
          <Text style={styles.descText}>Temps: {desc}</Text>
          {icon && (
            <View style={styles.iconContainer}>
              <Image source={{ uri: icon }} style={styles.icon} />
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  weatherContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fond semi-transparent pour contraste
    borderRadius: 10,
    padding: 15,
  },
  cityText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff", // Blanc pour contraste sur dégradé
    textAlign: "center",
    marginBottom: 8,
  },
  tempText: {
    fontSize: 18,
    color: "#ffeb3b", // Jaune vif pour la température
    textAlign: "center",
    marginBottom: 8,
  },
  descText: {
    fontSize: 16,
    color: "#black", // Bleu clair pour la description
    textAlign: "center",
    marginBottom: 15,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b", // Rouge pour les erreurs
    textAlign: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Fond léger pour l'icône
    borderRadius: 10,
    padding: 5,
  },
  icon: {
    width: 80,
    height: 80,
  },
});

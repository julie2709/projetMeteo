import { useState, useEffect } from "react";
import { Platform,Text,View,StyleSheet,Image, ActivityIndicator, ScrollView } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);
  const [temp, setTemp] = useState(null);
  const [desc, setDesc] = useState(null);
  const [icon, setIcon] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_Key = "743f2bb5eda305630fcd134141ea8e02";
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_Key}`;

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

        // Récupérer la position actuelle avec la latitude et logitude correspondante
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        const latitude = location.coords.latitude;
        console.log(`valeur de latitude : ${latitude}`);
        const longitude = location.coords.longitude;
        console.log(`valeur de longitude : ${longitude}`);
        // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_Key}`;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_Key}`;

        //stocker les données de l'API dans des variables

        // Appeler l'API OpenWeatherMap pour les données météo actuelles
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

        // Appeler l'API pour les prévisions sur 5 jours (toutes les 3 heures)
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_Key}&units=metric&lang=fr`
        );
        if (!forecastResponse.ok) {
          throw new Error(
            "Erreur lors de la récupération des prévisions météo"
          );
        }
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.list.slice(0, 40)); // 40 créneaux pour 5 jours
      } catch (error) {
        setErrorMsg(
          "Erreur lors de la récupération de la localisation : " + error.message
        );
      }

      //stocker les données de l'API dans des variables
    }

    getCurrentLocation();
  }, []);
// Fonction pour regrouper les prévisions par jour
  const groupByDay = (forecastData) => {
    console.log('groupByDay called with:', forecastData); // Débogage
    const days = [];
    let currentDay = null;
    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (day !== currentDay) {
        currentDay = day;
        days.push({ day, forecasts: [] });
      }
      days[days.length - 1].forecasts.push({
        time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
        desc: item.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      });
    });
    return days;
  };

  // Appliquer groupByDay aux données de prévision
  const groupedForecast = forecast.length > 0 ? groupByDay(forecast) : [];
  console.log('Grouped Forecast:', groupedForecast); // Débogage

  return (
    <LinearGradient
      colors={['#4facfe', '#00f2fe']} // Dégradé bleu vif
      style={styles.container}
    >
      {(!location || !city || !temp || !desc) && !errorMsg ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Météo actuelle */}
          <View style={styles.weatherContainer}>
            <Text style={styles.cityText}>Ville: {city}</Text>
            <Text style={styles.tempText}>Température: {temp}°C</Text>
            <Text style={styles.descText}>Temps: {desc}</Text>
            {icon && (
              <View style={styles.iconContainer}>
                <Image source={{ uri: icon }} style={styles.icon} />
              </View>
            )}
            <Text style={styles.forecastTitle}>Prévisions sur 5 jours</Text>
          </View>

          {/* Prévisions sur 5 jours */}
          {groupedForecast.length > 0 ? (
            groupedForecast.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.dayTitle}>{day.day}</Text>
                {day.forecasts.map((forecast, idx) => (
                  <View key={idx} style={styles.forecastItem}>
                    <Text style={styles.forecastText}>
                      {forecast.time} : {forecast.temp}°C, {forecast.desc}
                    </Text>
                    <Image source={{ uri: forecast.icon }} style={styles.forecastIcon} />
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.forecastText}>Aucune prévision disponible</Text>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  weatherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  tempText: {
    fontSize: 18,
    color: '#ffeb3b', // Jaune vif
    textAlign: 'center',
    marginBottom: 8,
  },
  descText: {
    fontSize: 16,
    color: '#80d8ff', // Bleu clair pour meilleure lisibilité
    textAlign: 'center',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b', // Rouge pour erreurs
    textAlign: 'center',
    margin: 20,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    padding: 5,
  },
  icon: {
    width: 80,
    height: 80,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dayContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fond léger pour chaque jour
    borderRadius: 10,
    padding: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  forecastText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
});

//   return (
//     <LinearGradient
//       colors={["#4facfe", "#00f2fe"]} // Dégradé bleu vif
//       style={styles.container}
//     >
//       <View>
//         <View style={styles.weatherContainer}>
//           <Text style={styles.cityText}>Ville: {city}</Text>
//           <Text style={styles.tempText}>Température: {temp}°C</Text>
//           <Text style={styles.descText}>Temps: {desc}</Text>
//           {icon && (
//             <View style={styles.iconContainer}>
//               <Image source={{ uri: icon }} style={styles.icon} />
//             </View>
//           )}
//         </View>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   weatherContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.2)", // Fond semi-transparent pour contraste
//     borderRadius: 10,
//     padding: 15,
//   },
//   cityText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#ffffff", // Blanc pour contraste sur dégradé
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   tempText: {
//     fontSize: 18,
//     color: "#ffeb3b", // Jaune vif pour la température
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   descText: {
//     fontSize: 16,
//     color: "#black", // Bleu clair pour la description
//     textAlign: "center",
//     marginBottom: 15,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "#ff6b6b", // Rouge pour les erreurs
//     textAlign: "center",
//   },
//   iconContainer: {
//     backgroundColor: "rgba(255, 255, 255, 0.3)", // Fond léger pour l'icône
//     borderRadius: 10,
//     padding: 5,
//   },
//   icon: {
//     width: 80,
//     height: 80,
//   },
// });

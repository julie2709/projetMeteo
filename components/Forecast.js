import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

// Composant pour une carte de jour
const DayCard = ({ day, forecasts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0));

  // Calculer la température moyenne du jour
  const avgTemp =
    forecasts.reduce((sum, f) => sum + f.temp, 0) / forecasts.length;

  // Animation pour afficher/masquer les détails
  const toggleDetails = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(heightAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, forecasts.length * 60], // Hauteur estimée pour chaque prévision
  });

  return (
    <View style={styles.dayContainer}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>{day}</Text>
        <View style={styles.daySummary}>
          <Image
            source={{ uri: forecasts[0].icon }}
            style={styles.forecastIcon}
          />
          <Text style={styles.avgTempText}>{avgTemp.toFixed(1)}°C</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleDetails}>
        <Text style={styles.toggleButtonText}>
          {isExpanded ? "Masquer" : "Afficher les détails"}
        </Text>
      </TouchableOpacity>
      <Animated.View
        style={[styles.detailsContainer, { height: animatedHeight }]}
      >
        {isExpanded && (
          <View style={styles.forecastList}>
            {forecasts.map((forecast, idx) => (
              <View key={idx} style={styles.forecastItem}>
                <Text style={styles.forecastText}>
                  {forecast.time} : {forecast.temp}°C, {forecast.desc}
                </Text>
                <Image
                  source={{ uri: forecast.icon }}
                  style={styles.forecastIcon}
                />
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const Forecast = ({ groupedForecast }) => (
  <View>
    <Text style={styles.forecastTitle}>Prévisions sur 5 jours</Text>
    {groupedForecast.length > 0 ? (
      groupedForecast.map((day, index) => (
        <DayCard key={index} day={day.day} forecasts={day.forecasts} />
      ))
    ) : (
      <Text style={styles.forecastText}>Aucune prévision disponible</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 15,
  },
  dayContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  daySummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  avgTempText: {
    fontSize: 18,
    color: "#ffeb3b",
    fontWeight: "600",
    marginLeft: 10,
  },
  toggleButton: {
    backgroundColor: "#DE7A22", // Jaune pour "Afficher"
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    opacity: 0.7,
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  detailsContainer: {
    overflow: "hidden", // Cache le contenu hors de la hauteur animée
  },
  forecastList: {
    paddingTop: 10,
  },
  forecastItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  forecastText: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
    fontWeight: "500",
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
});

export default Forecast;

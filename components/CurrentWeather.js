import { View, Text, Image, StyleSheet } from "react-native";

const CurrentWeather = ({ city, temp, desc, icon }) => (
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
);

const styles = StyleSheet.create({
  weatherContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  tempText: {
    fontSize: 20,
    color: "#ffeb3b",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  descText: {
    fontSize: 18,
    color: "#DE7A22",
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 8,
    marginBottom: 15,
  },
  icon: {
    width: 80,
    height: 80,
  },
});

export default CurrentWeather;

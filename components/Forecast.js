import { View, Text, Image, StyleSheet } from 'react-native';

const Forecast = ({ groupedForecast }) => (
  <View>
    <Text style={styles.forecastTitle}>Prévisions sur 5 jours</Text>
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
  </View>
);

const styles = StyleSheet.create({
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 15,
  },
  dayContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  forecastText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    fontWeight: '500',
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
});

export default Forecast;
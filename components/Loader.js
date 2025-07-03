import { View, Text, Image, Animated, Easing, StyleSheet } from 'react-native';
import { useEffect } from 'react';

const Loader = () => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View style={[styles.loaderIcon, { transform: [{ rotate: spin }] }]}>
        <Image
          source={{ uri: 'http://openweathermap.org/img/wn/02d@2x.png' }}
          style={styles.loaderImage}
        />
      </Animated.View>
      <Text style={styles.loaderText}>Chargement de la météo...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loaderImage: {
    width: 100,
    height: 100,
  },
  loaderText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Loader;
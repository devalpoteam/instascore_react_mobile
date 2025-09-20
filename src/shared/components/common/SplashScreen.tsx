import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

interface SplashScreenProps {
  onAnimationFinish?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationFinish,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onAnimationFinish, duration]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default SplashScreen;

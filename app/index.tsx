import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const INTRO_DATA = [
  {
    id: "1",
    title: "Lộ trình",
    titleGreen: "linh hoạt",
    description: "Cung cấp những nội dung học riêng cho mỗi mục tiêu khác nhau để giúp bạn đạt được thành quả tốt nhất.",
    image: require("../assets/images/intro/img1.png"),
    isLast: false,
  },
  {
    id: "2",
    title: "Học tập",
    titleGreen: "mọi lúc, mọi nơi",
    description: "Không tiện học phát âm ở nơi đông người? Không có thời gian để hoàn thành bài học dài? Chúng tôi luôn có lựa chọn khác cho bạn!",
    image: require("../assets/images/intro/img2.png"),
    isLast: false,
  },
  {
    id: "3",
    title: "Đánh giá",
    titleGreen: "chuyên sâu",
    titleOrder: "greenFirst", // Đánh giá (xanh) chuyên sâu (đen)
    description: "Theo dõi và đánh giá từng kỹ năng bạn dựa trên từng loại bài tập.",
    image: require("../assets/images/intro/img3.png"),
    isLast: true,
  },
];

export default function OnboardingScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderIndicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {INTRO_DATA.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const barWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 60, 10],
            extrapolate: "clamp",
          });

          const color = scrollX.interpolate({
            inputRange,
            outputRange: ["#D9D9D9", "#55BA5D", "#D9D9D9"],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.indicator,
                { width: barWidth, backgroundColor: color },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topIndicatorRow}>
        {renderIndicator()}
      </View>

      <FlatList
        data={INTRO_DATA}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {item.titleOrder === "greenFirst" ? (
                  <>
                    <Text style={styles.titleGreen}>{item.title}</Text>
                    {"\n"}
                    <Text>{item.titleGreen}</Text>
                  </>
                ) : (
                  <>
                    <Text>{item.title}</Text>
                    {"\n"}
                    <Text style={styles.titleGreen}>{item.titleGreen}</Text>
                  </>
                )}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* Buttons for only the last slide */}
            {item.isLast && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.loginBtn}
                  onPress={() => router.push("/(auth)/login")}
                >
                  <Text style={styles.loginBtnText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.registerBtn}
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text style={styles.registerBtnText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topIndicatorRow: {
    alignItems: "center",
    marginTop: 60,
    height: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    gap: 8,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
  },
  slide: {
    width: width,
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  textContainer: {
    width: width,
    paddingHorizontal: 40,
    marginBottom: 50, // Reduced to make space for buttons
    alignItems: "center",
  },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 32,
    textAlign: "center",
    color: "#3F3D56",
    lineHeight: 40,
  },
  titleGreen: {
    color: "#55BA5D",
  },
  description: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#7E7E7E",
    marginTop: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 40,
    width: width,
    justifyContent: "center",
  },
  loginBtn: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    maxWidth: (width - 60) / 2,
  },
  loginBtnText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#55BA5D",
  },
  registerBtn: {
    flex: 1,
    backgroundColor: "#55BA5D",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    maxWidth: (width - 60) / 2,
  },
  registerBtnText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
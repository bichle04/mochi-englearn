import { Tabs } from "expo-router";
import {
  HomeAngle2Bold,
  Flag2Bold,
  DiplomaBold,
  NotebookBold,
  UserBold,
} from "@solar-icons/react-native";
import ChatbotButton from "@/components/chatbot/ChatbotButton";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "#545454",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            elevation: 0, // for Android
            shadowOpacity: 0, // for iOS
            paddingTop: 8,
            paddingBottom: 8,
            height: 65,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ size, color }) => <HomeAngle2Bold size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: "Courses",
            tabBarIcon: ({ size, color }) => <Flag2Bold size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ielts-prep"
          options={{
            title: "IELTS Prep",
            tabBarIcon: ({ size, color }) => <DiplomaBold size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="notebook"
          options={{
            title: "Notebook",
            tabBarIcon: ({ size, color }) => <NotebookBold size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="personal"
          options={{
            title: "Profile",
            tabBarIcon: ({ size, color }) => <UserBold size={28} color={color} />,
          }}
        />
        <Tabs.Screen name="user" options={{ href: null }} />
        <Tabs.Screen name="stats" options={{ href: null }} />
        <Tabs.Screen name="change-pwd" options={{ href: null }} />
      </Tabs>
      <ChatbotButton />
    </View>
  );
}

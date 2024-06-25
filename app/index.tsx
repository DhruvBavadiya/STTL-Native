import { createTables } from "@/DB";
import "react-native-gesture-handler";
import Login from "@/Pages/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";
import Admin from "@/Pages/Admin";
import Register from "@/Pages/Register";
import UserList from "@/Pages/UserList";
import AddQuestion from "@/Pages/AddQuestion";
import Exam from "@/Pages/Exam";
import User from "@/Pages/User";
import { removeAnswers } from "@/Services/AsyncStorage";
import Report from "@/Pages/Report";
import { AppProvider } from "@/Context/AppContext";
import { useFonts } from "expo-font";

export default function Index() {
  const Stack = createStackNavigator();
  let [fontsLoaded] = useFonts({
  
    'CourierPrime-Regular':require('../assets/fonts/CourierPrime-Regular.ttf'),
    'CourierPrime-Bold':require('../assets/fonts/CourierPrime-Bold.ttf'),
    'CourierPrime-BoldItalic':require('../assets/fonts/CourierPrime-BoldItalic.ttf'),
    'CourierPrime-Italic':require('../assets/fonts/CourierPrime-Italic.ttf')
  })
  // useEffect(()=>{
  //   const erase = async()=>{
  //     await removeAnswers()
  //   }
  //   erase();
  // },[])
  return (
    <SQLiteProvider onInit={createTables} databaseName="qna.manage">
      <AppProvider>
        <NavigationContainer independent={true}>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={({ navigation }) => ({})}
          >
            <Stack.Screen name="Login" component={Login} 
            options={{ headerShown: false }} 
            />
            <Stack.Screen name="Admin" component={Admin} 
            
            options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="Question" component={AddQuestion} />
            <Stack.Screen name="Exam" component={Exam} />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="Report" component={Report}   />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SQLiteProvider>
  );
}

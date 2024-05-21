import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import DashNav from './DashNav';
//import HomePage from '../Pages/HomePage';

const Stack = createStackNavigator();

export default function AuthNav({ navigation }) {
  return (
        <Stack.Navigator independent={true}>
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }}/>
            <Stack.Screen name="DashNav" component={DashNav} options={{ headerShown: false }}/>
            {/* <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
  );
}
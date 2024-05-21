import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../Pages/HomePage';
import VehiclePage from '../Pages/VehiclePage';
import RequestVehiclePage from '../Pages/RequestVehiclePage';
import ConfirmRequestPage from '../Pages/ConfirmRequestPage';


const Stack = createStackNavigator();

export default function VehicleNav() {
  return (
    <NavigationContainer independent={true}>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }}/>
            <Stack.Screen name="Vehicle" component={VehiclePage} options={{ headerShown: false }}/>
            <Stack.Screen name="Request" component={RequestVehiclePage} options={{ headerShown: false }}/>
            <Stack.Screen name="Confirm" component={ConfirmRequestPage} options={{ headerShown: false }}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TripsPage from '../Pages/TripsPage';
import TripDetailsPage from '../Pages/TripDetailsPage';


const Stack = createStackNavigator();

export default function TripNav() {
  return (
    <NavigationContainer independent={true}>
        <Stack.Navigator>
            <Stack.Screen name="Trips" component={TripsPage} options={{ headerShown: false }}/>
            <Stack.Screen name="Trip" component={TripDetailsPage} options={{ headerShown: false }}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}
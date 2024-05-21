import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomePage from '../Pages/HomePage';
import ProfileNav from './ProfileNav';
import TripsPage from '../Pages/TripsPage';
import VehicleNav from './VehicleNav';
import TripNav from './TripNav';

const Tab = createBottomTabNavigator();

export default function DashNav({ navigation }) {
  return (
        <Tab.Navigator independent={true}>
            <Tab.Screen 
                name="Home" 
                component={VehicleNav} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                      <Ionicons name="home" color={'#4287f5'} size={25} />
                    ),
                }}
            />
            {/* <Tab.Screen 
                name="Report" 
                component={CreateFaultNav} 
                options={{
                    title: 'Report A Disaster',
                    tabBarLabel: 'Report',
                    tabBarIcon: () => (
                      <Ionicons name="add" color={'#4287f5'} size={25} />
                    ),
                }}
            /> */}
            <Tab.Screen 
                name="Trips" 
                component={TripNav}
                options={{
                    title: 'My Vehicle Requests',
                    tabBarLabel: 'Trips',
                    tabBarIcon: () => (
                      <Ionicons name="list" color={'#4287f5'} size={25} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileNav}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: () => (
                      <Ionicons name="person" color={'#4287f5'} size={25} />
                    ),
                }}
            />
        </Tab.Navigator>
  );
}
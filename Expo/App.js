import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import HomePage from './components/HomePage';
import Price from './components/Price';
import Damage from './components/Damage';
import Results from './components/Results';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: ...'], (isAffected, bundle) => {
  return isAffected || bundle.includes('example.js');
});

const App = createStackNavigator({
    HomePage                    : { screen: HomePage },
    Results                     : { screen: Results },
    Damage                      : { screen: Damage },
    Price                      : { screen: Price }
  },
  {
    initialRouteName: 'HomePage',
  }
);
export default createAppContainer(App);
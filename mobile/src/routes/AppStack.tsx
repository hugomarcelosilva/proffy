import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GiveClasses from '../pages/GiveClasses';
import Landing from '../pages/Landing';

import StudyTabs from './StudyTabs';

const { Navigator, Screen } = createStackNavigator();

const AppStack: React.FC = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Landing" component={Landing}></Screen>
        <Screen name="GiveClasses" component={GiveClasses}></Screen>
        <Screen name="Study" component={StudyTabs}></Screen>
      </Navigator>
    </NavigationContainer>
  );
};

export default AppStack;

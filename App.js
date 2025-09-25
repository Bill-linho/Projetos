import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Receitas from './Receitas';

const Stack = createStackNavigator();

const Menu = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Menu Inicial</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Receitas')}>
      <Text style={styles.buttonText}>Receitas</Text>
    </TouchableOpacity>
  </View>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen
        name="Receitas"
        component={Receitas}
        options={{ headerShown: true, title: 'Receitas' }} // Ativa o header e o botão de voltar
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;
import react, {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaViewBase, TextInput, TouchableOpacity, ScrollView} from 'react-native';

//import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Receita_da_vovó() {

  const [view,setView] = useState('')
  const [recipes,setRecipes] = useState('')
  const [titlo,setTitlo] = useState('')

  useEffect(()=>{
      const carregarRecipientes = async () => {
        try {
          const localdosRecipientes = await AsyncStorage.getItem('@recipes');
          if (localdosRecipientes !== null) {
            setRecipes(JSON.parse(localdosRecipientes));
          }
        } catch (erro) {
          console.error("Falha ao carregar receitas.", erro);
        }
      };
      carregarRecipientes();
  },[]);

  const addRecipiente = () => {

  }

  return (
    <View style={styles.container}>
      <Text>Lista de Receita</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

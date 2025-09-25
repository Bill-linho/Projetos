import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import react, { useState, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Receita_da_vovó() {

  const [view, setView] = useState('')
  const [recipes, setRecipes] = useState('')
  const [titulo, setTitulo] = useState('')
  const [igredientes, setIgredientes] = useState('')
  const [modoPreparo, setModoPreparo] = useState('')
  const [editar,setEditar] = useState(null)

  useEffect(() => {
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
  }, []);

  const startEditing = (recipe) => {
    setEditar(recipe),
    setTitulo(recipe.title),
    setIgredientes(recipe.ingredients)
    setModoPreparo(recipe.preparation)
    setView('form')
  }

  const addRecipiente = () => {
    if (!titulo) {
      return
    }

    if (editar) {
      setRecipes((currentRecipes) =>
        currentRecipes.map((recipe) =>
          recipe.id === editar.id
      ? {...recipe, title: titulo, igredientes: igredientes, preparation: modoPreparo}:recipe
    ))
    setEditar(null);
    }else{
    const novoRecipiente = {
      id: Date.now().toString(),
      title: titulo,
      ingredients: igredientes,
      preparation: modoPreparo,
    }
    setRecipes(currentRecipes => [...currentRecipes, novoRecipiente])
  }
    setTitulo('')
    setIgredientes('')
    setModoPreparo('')
    setView('lista')
  }

  const deletaRecipiente = (id) => {
    setRecipes(currentRecipes => currentRecipes.filter(recipes => recipes.id !== id))

  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.Scrollcontainer}>

        <Text style={styles.text}>Lista de Receita</Text>

        {view === 'lista' ? (<View>
          <TouchableOpacity style={styles.addbutton} onPress={() => setView('formulario')}>
            <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
          </TouchableOpacity>

          {recipes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
          ) : (
            recipes.map((item) => (
              <View key={item.id} style={styles.recipeItem}>

                <View style={styles.recipeTextContainer}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                </View>
                
                <TextInput style={[styles.input, styles.textArea]} placeholder="Modo de Preparo" value={modoPreparo} onChangeText={setModoPreparo} multiline={true}/>

                <Text style={styles.recipePreparation}>{item.preparation}</Text>

                <TouchableOpacity onPress={() => startEditing(item)}>
                  <Text style={styles.editarBTN2}>Editar Igredientes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deletaRecipiente(item.id)}>
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>

              </View>
            ))
          )}
        </View>
        ) : (

          <View style={styles.formContainer}>

            <Text style={styles.formHeader}>Adicionar Receita</Text>

            <TextInput style={styles.input} placeholder="Título da Receita" value={titulo} onChangeText={setTitulo} />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingredientes"
              value={igredientes}

              onChangeText={setIgredientes}
              multiline={true} />

            <View style={styles.formActions}>

              <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => setView('lista')}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={addRecipiente}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}

      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  Scrollcontainer: {
    padding: 16,
  },
  recipePreparation: {
    margin:10,
    fontSize: 16,
    color: '#34495e',
    marginTop: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#e67e22',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  editarBTN2:{
    color: 'white', 
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin:5
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  addbutton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
    color: '#3498db',
    fontSize: 16,
    marginTop: 5,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
});

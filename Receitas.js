import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, ScrollView, Modal } from 'react-native';
import react, { useState, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

const Receitas = ({navigation}) => {

  const [view, setView] = useState('lista')
  const [recipes, setRecipes] = useState([])
  const [titulo, setTitulo] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [modoPreparo, setModoPreparo] = useState('')
  const [editar, setEditar] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  useEffect(() => {
    const carregarReceitas = async () => {
      try {
        const data = await AsyncStorage.getItem('@recipes');
        if (data !== null) {
          setRecipes(JSON.parse(data));
        }
      } catch (erro) {
        console.error("Falha ao carregar receitas.", erro);
      }
    };
    carregarReceitas();
  }, []);

  const salvarNoAsync = async (lista) => {
    try {
      await AsyncStorage.setItem('@recipes', JSON.stringify(lista));
    } catch (erro) {
      console.error("Erro ao salvar receitas.", erro);
    }
  };


  const startEditing = (recipe) => {
    setEditar(recipe);
    setTitulo(recipe.title);
    setIngredientes(recipe.ingredients);
    setModoPreparo(recipe.preparation);
    setView('formulario');
  }

  const addRecipiente = () => {
    if (!titulo) {
      return;
    }

    let novasReceitas;

    if (editar) {
      novasReceitas = recipes.map((recipe) =>
        recipe.id === editar.id
          ? { ...recipe, title: titulo, ingredients: ingredientes, preparation: modoPreparo }
          : recipe
      );
      setEditar(null);
    } else {
      const novoRecipiente = {
        id: Date.now().toString(),
        title: titulo,
        ingredients: ingredientes,
        preparation: modoPreparo,
      };
      novasReceitas = [...recipes, novoRecipiente];
    }

    setRecipes(novasReceitas);
    salvarNoAsync(novasReceitas);

    setTitulo('');
    setIngredientes('');
    setModoPreparo('');
    setView('lista');
  };

  const deletaRecipienteConfirmar = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  const confirmarExclusao = () => {
    const novasReceitas = recipes.filter((recipe) => recipe.id !== idParaExcluir);
    setRecipes(novasReceitas);
    salvarNoAsync(novasReceitas);
    setShowModal(false);
  };

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
                  <Text style={styles.recipePreparation}>{item.preparation}</Text>
                </View>

                <View>
                  <TouchableOpacity onPress={() => startEditing(item)}>
                    <Text style={styles.editarBTN2}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletaRecipienteConfirmar(item.id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formHeader}>
            {editar ? 'Editar Receita' : 'Adicionar Receita'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Título da Receita"
            value={titulo}
            onChangeText={setTitulo}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingredientes"
            value={ingredientes}
            onChangeText={setIngredientes}
            multiline
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Modo de Preparo"
            value={modoPreparo}
            onChangeText={setModoPreparo}
            multiline
          />

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setView('lista')}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formButton, styles.saveButton]}
              onPress={addRecipiente}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
    <Modal visible={showModal} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <Text>Deseja excluir esta receita?</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity style={styles.modalButton} onPress={confirmarExclusao}>
              <Text>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  Scrollcontainer: {
    padding: 16,
  },
  recipePreparation: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 5,
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
  editarBTN2: {
    color: 'white',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'center',
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
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  recipeTextContainer: {
    marginBottom: 10,
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
    alignItems: 'center',
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
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalButton: { marginHorizontal: 10, padding: 10 },
});

export default Receitas;
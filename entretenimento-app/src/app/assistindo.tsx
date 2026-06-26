import { useState, useEffect, useRef } from 'react';

import { AntDesign } from '@expo/vector-icons'; //icones da biblioteca vector-icons
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { api } from '../services/api'
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../services/AuthContext';
import { Animated } from 'react-native';

interface Item {
  id: number;
  titulo: string;
  categoria: string;
  icone: string;
  temporada?: number;
  episodio?: number;
  tempo?: string;
}

const CATEGORIA_MAP: Record<string, { nome: string; icone: string }> = {
  filme: { nome: 'Filme', icone: '🎞️' },
  serie: { nome: 'Série', icone: '📺' },
  anime: { nome: 'Anime', icone: '🥷' },
};

const CATEGORIA_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORIA_MAP).map(([key, value]) => [value.nome, key])
);

const SECOES = [
  { key: 'filme', titulo: 'Filmes', icone: '🎞️' },
  { key: 'serie', titulo: 'Séries', icone: '📺' },
  { key: 'anime', titulo: 'Animes', icone: '🥷' },
];

export default function Assistindo() {
  const { user } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false) // hooks para abrir e feichar o formulario
  const [titulo, setTitulo] = useState('');
  const [itens, setItens] = useState<Item[]>([]);
  const [itemEditando, setItemEditando] = useState<number | null>(null);
  const [tipo, setTipo] = useState('');
  const [temporada, setTemporada] = useState('');
  const [episodio, setEpisodio] = useState('');
  const [tempo, setTempo] = useState('');

  async function salvarItem() {
    if (!titulo.trim()) return;

    const categoria = tipo ? (CATEGORIA_MAP[tipo]?.nome || null) : null;
    const icone = tipo ? (CATEGORIA_MAP[tipo]?.icone || null) : null;

    try {
      const dados = {
        titulo,
        categoria,
        icone,
        temporada: temporada ? Number(temporada) : undefined,
        episodio: episodio ? Number(episodio) : undefined,
        tempo: tempo || undefined,
        tipo_lista: 'assistindo',
      };

      if (itemEditando !== null) {
        await api.put(`/items/${itemEditando}`, dados);
      } else {
        await api.post('/items', dados);
      }

      await carregarItens();

      setTitulo('');
      setTipo('');
      setTemporada('');
      setEpisodio('');
      setTempo('');
      setItemEditando(null);
      setMostrarFormulario(false);

    } catch (error) {
      console.log(error);
    }
  }

  // funcao para exluir
  async function excluirItem(id: number) {
    try {
      await api.delete(`/items/${id}`);

      await carregarItens();
    } catch (error) {
      console.log(error);
    }
  }

  // funcao para editar
  function editarItem(item: Item) {
    setTitulo(item.titulo);
    setTipo(item.categoria ? CATEGORIA_REVERSE_MAP[item.categoria] || '' : '');
    setTemporada(item.temporada ? String(item.temporada) : '');
    setEpisodio(item.episodio ? String(item.episodio) : '');
    setTempo(item.tempo || '');
    setItemEditando(item.id);
    setMostrarFormulario(true);
  }

  async function carregarItens() {
    try {
      const response = await api.get('/items?tipo_lista=assistindo');
      console.log(response.data);
      setItens(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarItens();
  }, [user?.id]);

  function confirmarExclusao(id: number) {
    Alert.alert(
      'Excluir item',
      'Deseja realmente excluir este item?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/items/${id}`);

              await carregarItens();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  }

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.6, // menos transparente
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    // container da tela em geral
    <ScrollView style={styles.container}
      contentContainerStyle={styles.content}
      nestedScrollEnabled>

      {/* caixa do icone e do titulo principal da pagina */}
      <View style={styles.caixaTitulo}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <AntDesign name="play-square" size={55} color="#0000b3" />
        </Animated.View>

        <Text style={styles.titulo}> Assista e Guarde</Text>
      </View>

      {/* texto de baixo do titulo principal */}
      <Text style={styles.texto}>Guarde onde você parou de assistir seus filmes, séries e animes.</Text>

      {/* botao de adicionar os items criados */}
      {!mostrarFormulario && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMostrarFormulario(true)}
        >
          <View style={styles.buttonContainer}>
            <AntDesign name="plus" size={24} color="white" />
            <Text style={styles.buttonText}>
              Adicionar Novo Item
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* inicio formulario de criacao de items */}
      {mostrarFormulario && (
        <View style={styles.form}>
          <Text style={styles.title}>
            {itemEditando !== null
              ? 'Editar item'
              : 'Novo item'}
          </Text>

          <Text style={styles.label}>
            Título
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cosmos"
            placeholderTextColor="#9CA3AF"
            value={titulo}
            onChangeText={setTitulo}
          />

          {/* inicio escolher categoria */}
          <Text style={styles.label}>
            Tipo
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) =>
                setTipo(itemValue)
              }
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item
                label="Selecione um tipo:"
                value=""
              />

              <Picker.Item
                label="🎞️ Filme"
                value="filme"
              />

              <Picker.Item
                label="📺 Série"
                value="serie"
              />

              <Picker.Item
                label="🥷 Anime"
                value="anime"
              />

            </Picker>
          </View>
          {/* fim escolher categoria */}



          {(tipo === 'serie' || tipo === 'anime') && (
            <>
              <Text style={styles.label}>
                Temporada
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={temporada}
                onChangeText={setTemporada}
              />

              <Text style={styles.label}>
                Episódio
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={episodio}
                onChangeText={setEpisodio}
              />
            </>
          )}

          <Text style={styles.label}>
            Tempo
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 01:23:45"
            placeholderTextColor="#9CA3AF"
            value={tempo}
            onChangeText={setTempo}
          />

          <TouchableOpacity style={styles.saveButton} onPress={salvarItem}>
            <Text style={styles.saveButtonText}>
              {itemEditando !== null
                ? 'Atualizar'
                : 'Salvar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setMostrarFormulario(false);
              setTitulo('');
              setTipo('');
              setTemporada('');
              setEpisodio('');
              setTempo('');
              setItemEditando(null);
            }}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* fim formulario de criacao de items */}

      <View style={styles.separador} />

      {SECOES.map(({ key, titulo, icone }) => {
        const itensFiltrados = itens.filter(
          (item) => item.categoria === CATEGORIA_MAP[key].nome
        );
        if (itensFiltrados.length === 0) return null;
        return (
          <View key={key} style={styles.secao}>
            <Text style={styles.secaoTitulo}>{icone} {titulo}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carrossel}>
              {itensFiltrados.map((item) => (
                <View key={item.id} style={styles.carrosselItem}>
                  <View style={styles.carrosselItemInfo}>
                    <Text style={styles.carrosselItemText}>{item.titulo}</Text>
                    <View style={styles.carrosselTags}>
                      {(item.temporada || item.episodio) && (
                        <View style={styles.itemTagSerie}>
                          <Text style={styles.itemTagText}>Temporada {item.temporada} EP {item.episodio}</Text>
                        </View>
                      )}
                      {item.tempo && (
                        <View style={styles.itemTagTempo}>
                          <Text style={styles.itemTagText}>⏱ {item.tempo}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.carrosselAcoes}>
                    <TouchableOpacity onPress={() => editarItem(item)}>
                      <AntDesign name="edit" size={16} color="#60A5FA" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmarExclusao(item.id)}>
                      <AntDesign name="delete" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 100,
  },
  caixaTitulo: {
    gap: 5,
    marginTop: 24,
    flexDirection: 'row',
  },
  titulo: {
    color: '#fff',
    fontSize: 34,
    marginTop: 3,
  },
  texto: {
    color: 'gray',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1a8cff',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  form: {
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    color: '#fff',
    textAlign: 'left',
  },
  input: {
    color: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
  },
  saveButton: {
    color: '#fff',
    backgroundColor: '#1a8cff',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
  cancelButton: {
    color: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
  label: {
    color: '#fff',
    marginVertical: 15,
  },
  item: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemIcon: {
    fontSize: 20,
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
    flexShrink: 1,
  },
  itemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginLeft: 28,
  },
  itemTagCategoria: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemTagSerie: {
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemTagTempo: {
    backgroundColor: '#5c3d0e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  acoes: {
    flexDirection: 'row',
    gap: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  picker: {
    color: '#FFFFFF',
  },
  separador: {
    height: 30,
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  carrossel: {
    flexDirection: 'row',
  },
  carrosselItem: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    width: 180,
    justifyContent: 'space-between',
  },
  carrosselItemInfo: {
    flex: 1,
  },
  carrosselItemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  carrosselTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  carrosselAcoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
})
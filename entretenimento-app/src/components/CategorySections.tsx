import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SECOES, CATEGORIA_MAP } from '../services/constants';
import type { Item } from '../services/types';

interface CategorySectionsProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export function CategorySections({ items, onEdit, onDelete }: CategorySectionsProps) {
  return (
    <>
      {SECOES.map(({ key, titulo, icone }) => {
        const filtered = items.filter(
          (item) => item.categoria === CATEGORIA_MAP[key].nome,
        );
        if (filtered.length === 0) return null;

        return (
          <View key={key} style={styles.secao}>
            <Text style={styles.secaoTitulo}>
              {icone} {titulo}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.carrossel}
            >
              {filtered.map((item) => (
                <View key={item.id} style={styles.carrosselItem}>
                  <View style={styles.carrosselItemInfo}>
                    <Text style={styles.carrosselItemText}>{item.titulo}</Text>
                    {(item.temporada || item.episodio || item.tempo) && (
                      <View style={styles.carrosselTags}>
                        {(item.temporada || item.episodio) && (
                          <View style={styles.itemTagSerie}>
                            <Text style={styles.itemTagText}>
                              Temporada {item.temporada} EP {item.episodio}
                            </Text>
                          </View>
                        )}
                        {item.tempo && (
                          <View style={styles.itemTagTempo}>
                            <Text style={styles.itemTagText}>⏱ {item.tempo}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <View style={styles.carrosselAcoes}>
                    <TouchableOpacity onPress={() => onEdit(item)}>
                      <AntDesign name="edit" size={16} color="#60A5FA" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(item.id)}>
                      <AntDesign name="delete" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
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
  carrosselAcoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
});

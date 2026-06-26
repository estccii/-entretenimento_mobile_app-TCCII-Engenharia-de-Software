import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PICKER_ITENS } from '../services/constants';
import type { ItemFormData } from '../services/types';

interface ItemFormProps {
  data: ItemFormData;
  editing: boolean;
  onChange: (data: Partial<ItemFormData>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ItemForm({ data, editing, onChange, onSave, onCancel }: ItemFormProps) {
  const showSeasonFields = data.tipo === 'serie' || data.tipo === 'anime';

  return (
    <View style={styles.form}>
      <Text style={styles.title}>{editing ? 'Editar item' : 'Novo item'}</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Interestelar"
        placeholderTextColor="#9CA3AF"
        value={data.titulo}
        onChangeText={(v) => onChange({ titulo: v })}
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={data.tipo}
          onValueChange={(v) => onChange({ tipo: v })}
          style={styles.picker}
          dropdownIconColor="#FFFFFF"
        >
          {PICKER_ITENS.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tempo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 01:23:45"
        placeholderTextColor="#9CA3AF"
        value={data.tempo ?? ''}
        onChangeText={(v) => onChange({ tempo: v })}
      />

      {showSeasonFields && (
        <>
          <Text style={styles.label}>Temporada</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={data.temporada ?? ''}
            onChangeText={(v) => onChange({ temporada: v })}
          />

          <Text style={styles.label}>Episódio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={data.episodio ?? ''}
            onChangeText={(v) => onChange({ episodio: v })}
          />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>{editing ? 'Atualizar' : 'Salvar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    marginVertical: 15,
    fontSize: 16,
  },
  input: {
    color: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#1a1a2e',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
  },
  picker: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#1a8cff',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { CATEGORIA_MAP } from '../services/constants';
import type { Item, ItemFormData } from '../services/types';

export function useItems(tipoLista: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    titulo: '',
    tipo: '',
    tempo: '',
    temporada: '',
    episodio: '',
  });

  const loadItems = useCallback(async () => {
    try {
      const { data } = await api.get(`/items?tipo_lista=${tipoLista}`);
      setItems(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os itens');
    }
  }, [tipoLista]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const resetForm = useCallback(() => {
    setFormData({ titulo: '', tipo: '', tempo: '', temporada: '', episodio: '' });
    setEditingId(null);
    setFormVisible(false);
  }, []);

  const saveItem = useCallback(async () => {
    if (!formData.titulo.trim()) return;

    const categoria = formData.tipo ? (CATEGORIA_MAP[formData.tipo]?.nome || null) : null;
    const icone = formData.tipo ? (CATEGORIA_MAP[formData.tipo]?.icone || null) : null;

    const payload = {
      titulo: formData.titulo.trim(),
      categoria,
      icone,
      temporada: formData.temporada ? Number(formData.temporada) : undefined,
      episodio: formData.episodio ? Number(formData.episodio) : undefined,
      tempo: formData.tempo || undefined,
      tipo_lista: tipoLista,
    };

    try {
      if (editingId !== null) {
        await api.put(`/items/${editingId}`, payload);
      } else {
        await api.post('/items', payload);
      }

      await loadItems();
      resetForm();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o item');
    }
  }, [formData, editingId, tipoLista, loadItems, resetForm]);

  const editItem = useCallback((item: Item) => {
    const tipo = item.categoria
      ? (Object.entries(CATEGORIA_MAP).find(([, v]) => v.nome === item.categoria)?.[0] ?? '')
      : '';

    setFormData({
      titulo: item.titulo,
      tipo,
      tempo: item.tempo ?? '',
      temporada: item.temporada ? String(item.temporada) : '',
      episodio: item.episodio ? String(item.episodio) : '',
    });
    setEditingId(item.id);
    setFormVisible(true);
  }, []);

  const confirmDelete = useCallback((id: number) => {
    Alert.alert('Excluir item', 'Deseja realmente excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/items/${id}`);
            await loadItems();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o item');
          }
        },
      },
    ]);
  }, [loadItems]);

  return {
    items,
    formData,
    editingId,
    formVisible,
    setFormData,
    setFormVisible,
    saveItem,
    editItem,
    confirmDelete,
    resetForm,
  };
}

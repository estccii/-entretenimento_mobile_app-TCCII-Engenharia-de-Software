import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '../services/AuthContext';

export default function Categoria() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Escolha uma categoria</Text> */}

      <Pressable
        style={styles.button}
        onPress={() => router.push('/assistindo')}
      >
        <FontAwesome name="play-circle-o" size={34} color="blue" />
        <Text style={styles.buttonText}>Assistindo</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => router.push('/quero-assistir')}
      >
        <AntDesign name="clock-circle" size={27} color="yellow" />
        <Text style={styles.buttonText}>Quero assistir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
    padding: 25,
    gap: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1a8cff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonSecondary: {
    backgroundColor: '#2d3748',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});

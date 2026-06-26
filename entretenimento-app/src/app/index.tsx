import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.caixaTitulo}>
        <AntDesign name="play-square" size={55} color="#0000b3" />
        <Text style={styles.title}>Assista, Guarde e Organize</Text>
      </View>
      <Text style={styles.subtitle}>Organize seu Entretenimento</Text>
      <Pressable style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Entrar</Text>
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
  },
  caixaTitulo: {
    // gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    textAlign: 'center',
  },
  subtitle: {
    color: 'gray',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1a8cff',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});
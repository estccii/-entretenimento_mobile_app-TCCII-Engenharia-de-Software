import { Drawer } from 'expo-router/drawer';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { AuthProvider, useAuth } from '../services/AuthContext';
import { AntDesign } from '@expo/vector-icons';

function CustomDrawerContent({ navigation }: { navigation: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = [
    { label: 'Assistindo', route: '/assistindo' },
    { label: 'Quero Assistir', route: '/quero-assistir' },
  ] as const;

  function handleLogout() {
    logout();
    navigation.closeDrawer();
    router.replace('/');
  }

  return (
    <View style={styles.drawerContainer}>
      {user && (
        <View style={styles.userInfo}>
          <AntDesign name="user" size={24} color="#60A5FA" />
          <Text style={styles.userName}>{user.name}</Text>
        </View>
      )}

      <Text style={styles.drawerTitle}>Menu</Text>

      {items.map((item) => (
        <Pressable
          key={item.route}
          style={[
            styles.drawerItem,
            pathname === item.route && styles.drawerItemActive,
          ]}
          onPress={() => {
            router.push(item.route);
            navigation.closeDrawer();
          }}
        >
          <Text
            style={[
              styles.drawerItemText,
              pathname === item.route && styles.drawerItemTextActive,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}

      <View style={styles.spacer} />

      {user && (
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600', fontSize: 18 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="categoria"
          options={{
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="assistindo"
          options={{
            drawerLabel: 'Assistindo',
            title: 'Assistindo',
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#fff',
          }}
        />
        <Drawer.Screen
          name="quero-assistir"
          options={{
            drawerLabel: 'Quero Assistir',
            title: 'Quero Assistir',
          }}
        />
      </Drawer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a2e',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
    marginBottom: 20,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  drawerTitle: {
    color: '#e0e0e0',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  drawerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  drawerItemActive: {
    backgroundColor: '#16213e',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#a0a0b0',
  },
  drawerItemTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#2d3748',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
  },
});

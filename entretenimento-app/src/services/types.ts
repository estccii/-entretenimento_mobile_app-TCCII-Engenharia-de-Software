export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Item {
  id: number;
  titulo: string;
  categoria: string;
  icone: string;
  temporada?: number;
  episodio?: number;
  tempo?: string;
}

export interface ItemFormData {
  titulo: string;
  tipo: string;
  temporada?: string;
  episodio?: string;
  tempo?: string;
}

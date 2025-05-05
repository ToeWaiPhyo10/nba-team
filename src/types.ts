export interface ApiResponse<T> {
  data: T[];
  meta: {
    total_pages: number;
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
  };
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface Team {
  id: number;
  full_name: string;
  city: string;
  region: string;
  name?: string;
  players: Player[];
}

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  position: string;
  team: {
    id: number;
    full_name: string;
    city: string;
  };
}

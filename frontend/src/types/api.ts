// frontend/src/types/api.ts
import type { Compte } from '../app/types/backend';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  compte: Compte;
}

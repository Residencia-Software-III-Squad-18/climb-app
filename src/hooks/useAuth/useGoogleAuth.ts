import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

interface GoogleAuthUrlResponse {
  authorizationUrl: string;
}

interface ExchangeCodeResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    usuario: {
      id: number;
      nomeCompleto: string;
      email: string;
      cargoNome: string;
    };
  };
}

export const useGoogleAuthUrl = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get<GoogleAuthUrlResponse>("/auth/google/url");
      return response.data;
    },
  });
};

export const useExchangeGoogleCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post<ExchangeCodeResponse>("/auth/exchange", {
        code,
      });
      return response.data;
    },
  });
};

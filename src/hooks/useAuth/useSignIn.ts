import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface SignInCredentials {
  email: string;
  senha: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  usuario?: {
    id?: number;
    email?: string;
    nomeCompleto?: string;
    cargoNome?: string;
    cargo?: string;
    role?: string;
  };
}

export const signInRequest = async (credentials: SignInCredentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("📦 Resposta bruta:", response.data);

    // A API retorna: {
    //   success,
    //   data: { accessToken, refreshToken, usuario },
    //   expiresIn,
    //   message,
    //   timestamp
    // }

    const { data: sessionData } = response.data;

    return {
      ...sessionData,
      expiresIn: sessionData?.expiresIn ?? response.data?.expiresIn,
    };
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const useSignIn = () => {
  return useMutation<Session, AxiosError, SignInCredentials>({
    mutationFn: signInRequest,
  });
};

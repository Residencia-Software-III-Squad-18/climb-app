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
  /** OAuth access token for Google Calendar when the backend returns it on login. */
  googleAccessToken?: string;
  usuario?: {
    id?: number;
    email?: string;
    nomeCompleto?: string;
  };
}

export const signInRequest = async (credentials: SignInCredentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    // A API retorna: {
    //   success,
    //   data: { accessToken, refreshToken, usuario },
    //   expiresIn,
    //   message,
    //   timestamp
    // }

    const { data: sessionData, expiresIn } = response.data;

    return {
      ...sessionData,
      expiresIn,
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

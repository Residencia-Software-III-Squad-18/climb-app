import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import InvestmentGraphics from "@/components/InvestimentGraphic";

import { useAuthContext } from "@/context";
import { ClimbLogo } from "@/icons/ClimbLogo";
import { useThemeStore } from "@/store/useThemeStore";

export function Login() {
  const { control, handleSubmit } = useForm<{ email: string; senha: string }>({
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const { handleSignIn, isPending } = useAuthContext();
  const { theme } = useThemeStore();

  const onSubmit = (data: { email: string; senha: string }) => {
    handleSignIn(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-0 bg-lightbg dark:bg-darkbg">
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-white">
            <ClimbLogo
              size={64}
              color={theme === "light" ? "#2BBFA4" : "white"}
              className="fixed top-8 left-8"
            />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#0f1b2d] dark:text-white">
              Acesso ao ambiente
              <br />
              <span className="text-primary">interno</span>
            </h2>
            <p className="text-gray-400 mb-12 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-12">
              Plataforma restrita para operações análises e gestão patrimonial.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <Input
                name="email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                control={control}
                required
              />

              {/* Password Input */}

              <Input
                name="senha"
                label="Senha"
                type="password"
                placeholder="••••••••"
                control={control}
                required
              />
              <div className="flex justify-between items-center">
                <a
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary/70 font-medium"
                >
                  Esqueceu a senha?
                </a>
                <a
                  href="/request-access"
                  className="text-xs text-primary hover:text-primary/70 font-medium"
                >
                  Solicitar acesso
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 mt-6"
              >
                {isPending ? "Acessando..." : "Acessar Portfólio"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ou
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600 text-light-text dark:text-white"
            >
              <FcGoogle size={20} />
              <span>Continuar com Google</span>
            </Button>

            <p className="text-gray-400 text-sm mt-8 fixed bottom-8">
              &copy; 2026 Climb. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
      {/* Coluna 2 - Formulário */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <InvestmentGraphics />
        </div>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FiLayout } from "react-icons/fi";
import { LuShield } from "react-icons/lu";
import { SlGraph } from "react-icons/sl";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

import { useAuthContext } from "@/context";
import { ClimbLogo } from "@/icons/ClimbLogo";

export function Login() {
  const { control, handleSubmit } = useForm<{ email: string; senha: string }>({
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const { handleSignIn, isPending } = useAuthContext();

  const onSubmit = (data: { email: string; senha: string }) => {
    handleSignIn(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#0E1822]">
      {/* Coluna 1 - Conteúdo Escuro */}
      <div className="hidden md:flex items-center justify-center p-8 bg-[#0E1822]">
        <div className="text-white">
          <ClimbLogo size={64} color="white" className="fixed top-8 left-8" />
          <h2 className="text-5xl font-bold mb-4">
            Seus investimentos,
            <br />
            <span className="text-[#2BBFA4]">sob controle total</span>.
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Acompanhe seu portfólio, gerencie contratos e tome decisões com
            inteligência patrimonial.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#2BBFA4] bg-opacity-10 rounded flex items-center justify-center flex-shrink-0 ">
                <SlGraph size={24} className="text-[#2BBFA4]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Rentabilidade</h3>
                <p className="text-gray-400 text-sm">Análise em tempo real</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#2BBFA4] bg-opacity-10 rounded flex items-center justify-center flex-shrink-0 ">
                <LuShield size={24} className="text-[#2BBFA4]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Segurança</h3>
                <p className="text-gray-400 text-sm">Criptografia avançada</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-[#2BBFA4] bg-opacity-10 rounded flex items-center justify-center flex-shrink-0 ">
                <FiLayout size={24} className="text-[#2BBFA4]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Relatórios</h3>
                <p className="text-gray-400 text-sm">Dados consolidados</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-8 fixed bottom-8">
            &copy; 2026 Climb. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Coluna 2 - Formulário */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F1B2D] dark:text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Acesse sua conta para gerenciar seus investimentos.
            </p>
          </div>

          {/* Form */}
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
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-[#0F1B2D] dark:text-white">
                  Senha
                </label>
                <a
                  href="#"
                  className="text-xs text-[#2BBFA4] hover:text-[#2d8373] font-medium"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                name="senha"
                type="password"
                placeholder="••••••••"
                control={control}
                required
              />
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
            <span className="text-sm text-gray-500 dark:text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600 text-[#0F1B2D] dark:text-white"
          >
            <FcGoogle size={20} />
            <span>Continuar com Google</span>
          </Button>

          {/* Sign Up Link */}
          <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Não possui conta?{" "}
            <a
              href="#"
              className="text-[#2BBFA4] hover:text-[#2d8373] font-medium"
            >
              Solicitar acesso
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

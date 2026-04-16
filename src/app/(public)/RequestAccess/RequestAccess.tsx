import { useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

import { ClimbLogo } from "@/icons/ClimbLogo";
import { useThemeStore } from "@/store/useThemeStore";

export function RequestAccess() {
  const { control, handleSubmit } = useForm<{
    nome: string;
    email: string;
    empresa: string;
    cargo: string;
  }>({
    defaultValues: {
      nome: "",
      email: "",
      empresa: "",
      cargo: "",
    },
  });

  const { theme } = useThemeStore();

  const onSubmit = (data: {
    nome: string;
    email: string;
    empresa: string;
    cargo: string;
  }) => {
    console.log("Solicitação de acesso:", data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-lightbg dark:bg-darkbg">
      <div className="absolute top-8 left-8">
        <ClimbLogo
          size={64}
          color={theme === "light" ? "#2BBFA4" : "white"}
          className="mb-12"
        />
      </div>

      <div className="w-full max-w-md">
        <a
          href="/"
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/70"
        >
          <IoArrowBack size={20} />
          <span className="text-sm font-medium">Voltar ao acesso</span>
        </a>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#0f1b2d] dark:text-white">
          Solicitar <br />
          <span className="text-primary">acesso</span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8">
          Envie seus dados corporativos para análise de liberação ao ambiente
          interno
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="nome"
            label="Nome completo"
            type="text"
            placeholder="Seu nome"
            control={control}
            required
          />

          <Input
            name="email"
            label="E-mail corporativo"
            type="email"
            placeholder="nome@empresa.com.br"
            control={control}
            required
          />

          <Input
            name="empresa"
            label="Empresa"
            type="text"
            placeholder="Nome da empresa"
            control={control}
            required
          />

          <Input
            name="cargo"
            label="Cargo"
            type="text"
            placeholder="Seu cargo"
            control={control}
            required
          />

          <Button type="submit" className="w-full h-12 mt-6">
            Enviar solicitação
            <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </form>
        <p className="text-gray-400 text-sm mt-8 fixed bottom-8">
          &copy; 2026 Climb. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

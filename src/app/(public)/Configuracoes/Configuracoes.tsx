import { useState } from "react";

import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";

interface UserData {
  name: string;
  email: string;
  dataNascimento: string;
  password: string;
}

export function Configuracoes() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "Paulo Silva",
    email: "paulo.silva@climb.com.br",
    dataNascimento: "15/03/1990",
    password: "••••••••",
  });

  const [editData, setEditData] = useState<UserData>(userData);
  const [showPassword, setShowPassword] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <LayoutContainer title="Configurações">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0e1822] dark:text-white">
              Configurações
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie seus dados pessoais e preferências
            </p>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white">
              Dados Pessoais
            </h3>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm"
              >
                Editar
              </button>
            )}
          </div>

          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Nome
                </label>
                <p className="text-base text-[#0e1822] dark:text-white">
                  {userData.name}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Email
                </label>
                <p className="text-base text-[#0e1822] dark:text-white">
                  {userData.email}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Data de Nascimento
                </label>
                <p className="text-base text-[#0e1822] dark:text-white">
                  {userData.dataNascimento}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Senha
                </label>
                <p className="text-base text-[#0e1822] dark:text-white">
                  {userData.password}
                </p>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Nome
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Email (não editável)
                </label>
                <input
                  type="email"
                  value={editData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={editData.dataNascimento}
                  onChange={(e) =>
                    handleInputChange("dataNascimento", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Nova Senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha..."
                  value={
                    editData.password === userData.password
                      ? ""
                      : editData.password
                  }
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#0e1822] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="showPassword"
                    className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    Mostrar senha
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors font-medium text-sm"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Outras Configurações */}
        <div className="bg-white dark:bg-[#1a2532] rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-[#0e1822] dark:text-white mb-6">
            Preferências
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#0e1822] dark:text-white">
                  Notificações
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receber notificações por email
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#0e1822] dark:text-white">
                    Modo Escuro
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ativar modo escuro por padrão
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
}

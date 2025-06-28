import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioNome, setUsuarioNome] = useState("");
  const [cargoUsuario, setCargoUsuario] = useState("");
  const [isloading, setIsloading] = useState(true)

  useEffect(() => {
    const nome = localStorage.getItem("userName") || "";
    const cargo = localStorage.getItem("userCargo") || "";
    setIsloading(false);

    setUsuarioNome(nome);
    setCargoUsuario(cargo);
  }, []);

  const login = (data) => {
    const nome = data.nome_cliente || data.nome || "Visitante";
    const email = data.email_cliente || data.email || "";
    const cargo = data.cargo || ""; 

    console.log("Usuário logado:", nome, email, cargo);

    localStorage.setItem("userName", nome);
    localStorage.setItem("email", email);
    localStorage.setItem("userCargo", cargo);

    setUsuarioNome(nome);
    setCargoUsuario(cargo);
  };

  const logout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("userCargo");
    setUsuarioNome("");
    setCargoUsuario("");
  };

  return (
    <AuthContext.Provider value={{ usuarioNome, cargoUsuario, isloading,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
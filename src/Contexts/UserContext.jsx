import { useState, useEffect, createContext } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

  const [usuarioNome, setUsuarioNome] = useState("")

  useEffect(() => {
    const nome = localStorage.getItem("userName") || ""
    setUsuarioNome(nome)
  }, [])

  const login = (data) => {
  const nome = data.nome_cliente || data.nome || "Visitante";
  const email = data.email_cliente || data.email || "";

  console.log("Usuário logado:", nome, email);
  localStorage.setItem("userName", nome);
  localStorage.setItem("email", email);
  setUsuarioNome(email);
};

  const logout = () => {
    localStorage.removeItem("userName")
    localStorage.removeItem("email")
    setUsuarioNome("")
  }

  return (
    <AuthContext.Provider value={{usuarioNome, login, logout}}>
      {children}
    </AuthContext.Provider>
  )

}
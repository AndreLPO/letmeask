import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../services/firebase";

type AuthContextType = {
  user: User | undefined;
  loginComGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

type User = {
  id: string;
  name: string;
  avatarURL: string;
};

type AuthContextProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProps) {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Conta Google faltando informações! (Foto ou Nome)");
        }

        setUser({
          id: uid,
          name: displayName,
          avatarURL: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
      //boa prática, se descadastrar do evento listener ao final, para quando sair da tela, não dar erro
    };
  }, []);

  async function loginComGoogle() {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Conta Google faltando informações! (Foto ou Nome)");
      }

      setUser({
        id: uid,
        name: displayName,
        avatarURL: photoURL,
      });
    }
  }

  async function logout() {
    await auth.signOut();
    setUser({ id: "", name: "", avatarURL: "" });
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{ user, loginComGoogle, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";
import { useNavigate } from "react-router-dom";

import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const navigate = useNavigate();
  const { user, loginComGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await loginComGoogle();
    }
    navigate("/rooms/new");
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Imagem de fundo" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-container">
          <img src={logoImg} alt="Logo" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form>
            <input type="text" placeholder="Digite o código da sala" />
            <Button type="submit"> Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";
import { useNavigate } from "react-router-dom";

import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { child, get, ref } from "@firebase/database";

export function Home() {
  const navigate = useNavigate();
  const { user, loginComGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await loginComGoogle();
    }
    navigate("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = ref(database);

    get(child(roomRef, `rooms/${roomCode}`)).then((room) => {
      if (!room.exists()) {
        alert("Sala não existe!");
        return;
      }

      navigate(`/rooms/${roomCode}`);
    });
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
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit"> Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

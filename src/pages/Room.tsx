import { onValue, push, ref } from "firebase/database";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import "../styles/room.scss";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatarURL: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatarURL: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function Room() {
  const { user, loginComGoogle, logout } = useAuth();
  const { id } = useParams();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitles] = useState("");

  useEffect(() => {
    const roomRef = ref(database, `rooms/${id}`);
    onValue(
      roomRef,
      (room) => {
        const databaseRoom = room.val();
        const firebaseQuestions: FirebaseQuestions =
          databaseRoom.questions ?? {};

        const parsedQuestions = Object.entries(firebaseQuestions).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
            };
          }
        );
        setTitles(databaseRoom.title);
        setQuestions(parsedQuestions);
      },
      {
        onlyOnce: true,
      }
    );
  }, [id]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      alert("Usuário não conectado!");
      throw new Error("Usuário não conectado!");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user.avatarURL,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await push(ref(database, `rooms/${id}/questions`), question);
    alert("Pergunta criada com sucesso!");

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            {" "}
            <img src={logoImg} alt="Logo" />
          </Link>

          <RoomCode code={id} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length}{" "}
              {questions.length > 1 ? "perguntas" : "pergunta"}
            </span>
          )}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img
                  src={user.avatarURL}
                  alt={`Foto de perfil de ${user.name}`}
                />
                <span>{user.name}</span>
                <button onClick={logout}>Sair</button>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,{" "}
                <button onClick={loginComGoogle}>faça seu login </button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              {" "}
              Enviar pergunta{" "}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

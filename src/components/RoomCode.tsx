import copyImg from "../assets/images/copy.svg";
import "../styles/room-code.scss";

type RoomCodeProps = {
  code: any;
};

export function RoomCode(props: RoomCodeProps) {
  function copyToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="room-code" onClick={copyToClipboard}>
      <div>
        <img src={copyImg} alt="Icone de copiar" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}

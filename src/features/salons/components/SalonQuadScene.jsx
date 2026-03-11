import { useState, useRef, useEffect } from "react";
import "./SalonQuadScene.css";

// ─── DONNÉES MOCK ─────────────────────────────────────────────────────────────
// Remplacer plus tard par les vrais participants du salon

const MOCK_PARTICIPANTS = [
  {
    id: "sophie",
    name: "Sophie",
    avatar: "🙂",           // remplacer par <UserAvatar user={...} size={52} />
    offerings: ["🍔", "🍟"], // remplacer par les effectDef actifs de l'effectEngine
    position: "top-left",
    online: true,
  },
  {
    id: "emma",
    name: "Emma",
    avatar: "🙂",
    offerings: ["🍹"],
    position: "top-right",
    online: true,
  },
  {
    id: "alex",
    name: "Alex",
    avatar: "😎",
    offerings: ["🍺", "🍔"],
    position: "bottom-left",
    online: true,
  },
  {
    id: "you",
    name: "Vous",
    avatar: "🙂",
    offerings: ["🍺"],
    position: "bottom-right",
    online: true,
    isMe: true,
  },
];

const MOCK_MESSAGES = [
  { id: 1, author: "Alex",   authorId: "alex",   text: "Salut !" },
  { id: 2, author: "Emma",   authorId: "emma",   text: "Merci pour le mojito 🍹" },
  { id: 3, author: "Sophie", authorId: "sophie", text: "Je mange 🍔" },
];

// ─── PARTICIPANT CARD ─────────────────────────────────────────────────────────

function ParticipantCard({ participant, isMe }) {
  return (
    <div className={`sqp__card sqp__card--${participant.position}${isMe ? " sqp__card--me" : ""}`}>
      {/* Nom */}
      <div className="sqp__name">{participant.name}</div>

      {/* Avatar — swap pour <UserAvatar user={participant} size={52} /> quand prêt */}
      <div className={`sqp__avatar${participant.online ? " sqp__avatar--online" : ""}`}>
        <span>{participant.avatar}</span>
        {participant.online && <div className="sqp__online-dot" />}
      </div>

      {/* Offrandes actives — swap pour des icônes d'effets depuis effectEngine */}
      {participant.offerings.length > 0 && (
        <div className="sqp__offerings">
          {participant.offerings.map((item, i) => (
            <span key={i} className="sqp__offering-item">{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DISCUSSION ───────────────────────────────────────────────────────────────

function Discussion({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="sqp__discussion">
      <div className="sqp__discussion-inner">
        {messages.map((msg) => (
          <div key={msg.id} className="sqp__message">
            <span className="sqp__message-author">{msg.author}</span>
            <span className="sqp__message-text">{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── ACTION BAR ───────────────────────────────────────────────────────────────

function ActionBar({ onSend, onOffrandes, onMagie }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  };

  return (
    <div className="sqp__actionbar">
      <div className="sqp__input-row">
        <input
          className="sqp__input"
          type="text"
          placeholder="Écrire un message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="sqp__send-btn"
          type="button"
          onClick={handleSend}
          aria-label="Envoyer"
        >
          ➤
        </button>
      </div>
      <div className="sqp__btn-row">
        <button className="sqp__btn sqp__btn--offrandes" type="button" onClick={onOffrandes}>
          🎁 <span>Offrandes</span>
        </button>
        <button className="sqp__btn sqp__btn--magie" type="button" onClick={onMagie}>
          ✨ <span>Magie</span>
        </button>
      </div>
    </div>
  );
}

// ─── SALON QUAD SCENE ─────────────────────────────────────────────────────────
// Props :
//   salon        { name, emoji, gradient? }     — données du salon (optionnel pour le mock)
//   onBack       () => void                      — retour arrière
//   onOffrandes  () => void                      — ouvre OffrandesPanel tab offrandes
//   onMagie      () => void                      — ouvre OffrandesPanel tab pouvoirs
//   participants  tableau de participants réels  — optionnel, utilise mock si absent
//   currentUser   objet utilisateur courant

export default function SalonQuadScene({
  salon,
  onBack,
  onOffrandes,
  onMagie,
  participants: externalParticipants,
  currentUser,
}) {
  const participants = externalParticipants ?? MOCK_PARTICIPANTS;
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSend = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: currentUser?.name ?? "Vous",
        authorId: currentUser?.id ?? "you",
        text,
      },
    ]);
  };

  const salonName  = salon?.name  ?? "Café de Paris 2.0";
  const salonEmoji = salon?.emoji ?? "☕";

  return (
    <section className="sqp">
      {/* ── HEADER ── */}
      <header className="sqp__header" style={salon?.gradient ? { background: salon.gradient } : undefined}>
        <button className="sqp__back" type="button" onClick={onBack}>←</button>
        <div className="sqp__header-title">
          <span className="sqp__header-emoji">{salonEmoji}</span>
          <span className="sqp__header-name">{salonName}</span>
        </div>
        <div className="sqp__header-spacer" />
      </header>

      {/* ── BOARD : 2×2 + DISCUSSION ── */}
      <div className="sqp__board">
        {participants.map((p) => (
          <ParticipantCard
            key={p.id}
            participant={p}
            isMe={p.isMe || p.id === (currentUser?.id ?? "you")}
          />
        ))}

        {/* Zone centrale */}
        <Discussion messages={messages} />
      </div>

      {/* ── ACTION BAR ── */}
      <ActionBar
        onSend={handleSend}
        onOffrandes={onOffrandes}
        onMagie={onMagie}
      />
    </section>
  );
}

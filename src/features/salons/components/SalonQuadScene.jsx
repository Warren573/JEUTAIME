import { useState, useRef, useEffect } from "react";
import "./SalonQuadScene.css";

// ─── DONNÉES MOCK ─────────────────────────────────────────────────────────────

const MOCK_PARTICIPANTS = [
  {
    id: "sophie",
    name: "Sophie",
    avatar: "🙂",
    offerings: ["🍔", "🍟", "🌹", "🍺", "🍰", "💌"],
    position: "top-left",
    online: true,
  },
  {
    id: "emma",
    name: "Emma",
    avatar: "🙂",
    offerings: ["🍹", "🍰", "💌", "🍓", "🍸", "🌸"],
    position: "top-right",
    online: true,
  },
  {
    id: "alex",
    name: "Alex",
    avatar: "😎",
    offerings: ["🍺", "🍔", "🌭", "🍟", "☕", "🍫"],
    position: "bottom-left",
    online: true,
  },
  {
    id: "you",
    name: "Vous",
    avatar: "🙂",
    offerings: ["🍟", "☕", "🍫", "🍾", "🍓", "💌"],
    position: "bottom-right",
    online: true,
    isMe: true,
  },
];

const MOCK_MESSAGES = [
  { id: 1, author: "Alex",   text: "Salut !" },
  { id: 2, author: "Emma",   text: "Merci pour le mojito 🍹" },
  { id: 3, author: "Sophie", text: "Je mange 🍔" },
];

// ─── OFFERINGS GRID ───────────────────────────────────────────────────────────

function OfferingsGrid({ items = [] }) {
  const visibleItems = items.slice(0, 6);
  return (
    <div className="offerings-grid">
      {visibleItems.map((item, index) => (
        <div key={index} className="offering-cell">
          <span className="offering-emoji">{item}</span>
        </div>
      ))}
    </div>
  );
}

// ─── AVATAR BADGE ─────────────────────────────────────────────────────────────

function AvatarBadge({ avatar, isSelf = false }) {
  return (
    <div className={`avatar-badge ${isSelf ? "self" : ""}`}>
      <div className="avatar-circle">{avatar}</div>
      <span className="online-dot" />
    </div>
  );
}

// ─── PLAYER SLOT ──────────────────────────────────────────────────────────────

function PlayerSlot({ name, avatar, offerings, offerSide = "right", isSelf = false, position }) {
  return (
    <div className={`player-slot ${position}`}>
      <div className="player-name">{name}</div>
      <div className={`player-row ${offerSide === "left" ? "offers-left" : "offers-right"}`}>
        {offerSide === "left" && <OfferingsGrid items={offerings} />}
        <AvatarBadge avatar={avatar} isSelf={isSelf} />
        {offerSide === "right" && <OfferingsGrid items={offerings} />}
      </div>
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
    <div className="chat-area">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <span className="chat-author">{msg.author} :</span>{" "}
            <span className="chat-text">{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── ACTION BAR ───────────────────────────────────────────────────────────────

function ActionBar({ onSend, onOffrandes, onMagie, onFocus, onBlur, isFocused }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  };

  return (
    <footer className={`sqp__actionbar${isFocused ? " sqp__actionbar--focused" : ""}`}>
      <div className="sqp__input-row">
        <input
          className="sqp__input"
          type="text"
          placeholder="Écrire un message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onFocus={onFocus}
          onBlur={onBlur}
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
          🎁 Offrandes
        </button>
        <button className="sqp__btn sqp__btn--magie" type="button" onClick={onMagie}>
          ✨ Magie
        </button>
      </div>
    </footer>
  );
}

// ─── SALON QUAD SCENE ─────────────────────────────────────────────────────────

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
  const [focused, setFocused] = useState(false);

  const handleSend = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), author: currentUser?.name ?? "Vous", text },
    ]);
  };

  const isMe = (p) => p.isMe || p.id === (currentUser?.id ?? "you");

  const tl = participants.find(p => p.position === "top-left");
  const tr = participants.find(p => p.position === "top-right");
  const bl = participants.find(p => p.position === "bottom-left");
  const br = participants.find(p => p.position === "bottom-right");

  const salonName  = salon?.name  ?? "Café de Paris 2.0";
  const salonEmoji = salon?.emoji ?? "☕";

  return (
    <div className={`sqp${focused ? " sqp--typing" : ""}`}>
      <header className="sqp__header" style={salon?.gradient ? { background: salon.gradient } : undefined}>
        <button className="sqp__back" type="button" onClick={onBack}>←</button>
        <div className="sqp__header-title">
          {salonEmoji} {salonName}
        </div>
      </header>

      <main className="sqp__board">
        {tl && <PlayerSlot position="top-left"     name={tl.name} avatar={tl.avatar} offerings={tl.offerings} offerSide="right" isSelf={isMe(tl)} />}
        {tr && <PlayerSlot position="top-right"    name={tr.name} avatar={tr.avatar} offerings={tr.offerings} offerSide="left"  isSelf={isMe(tr)} />}
        <Discussion messages={messages} />
        {bl && <PlayerSlot position="bottom-left"  name={bl.name} avatar={bl.avatar} offerings={bl.offerings} offerSide="right" isSelf={isMe(bl)} />}
        {br && <PlayerSlot position="bottom-right" name={br.name} avatar={br.avatar} offerings={br.offerings} offerSide="left"  isSelf={isMe(br)} />}
      </main>

      <ActionBar
        onSend={handleSend}
        onOffrandes={onOffrandes}
        onMagie={onMagie}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        isFocused={focused}
      />
    </div>
  );
}

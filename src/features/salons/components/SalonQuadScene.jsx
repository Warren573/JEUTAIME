import { useState, useRef, useEffect } from "react";
import "./SalonQuadScene.css";

// ─── DONNÉES MOCK ─────────────────────────────────────────────────────────────

const MOCK_PARTICIPANTS = [
  {
    id: "sophie",
    name: "Sophie",
    avatar: "🙂",
    offerings: ["🍔", "🍟", "🌹"],
    position: "top-left",
    online: true,
  },
  {
    id: "emma",
    name: "Emma",
    avatar: "🙂",
    offerings: ["🍹", "🍰", "💌"],
    position: "top-right",
    online: true,
  },
  {
    id: "alex",
    name: "Alex",
    avatar: "😎",
    offerings: ["🍺", "🍔", "🌭"],
    position: "bottom-left",
    online: true,
  },
  {
    id: "you",
    name: "Vous",
    avatar: "🙂",
    offerings: ["🍟", "☕", "🍫"],
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

// ─── OFFERING SLOT ────────────────────────────────────────────────────────────
// Composant réutilisable — recevra plus tard images PNG / icônes / animations

function OfferingSlot({ content, isOverflow }) {
  return (
    <div className={`sqp__offering-slot${isOverflow ? " sqp__offering-slot--overflow" : ""}`}>
      {content}
    </div>
  );
}

// ─── OFFERINGS GRID ───────────────────────────────────────────────────────────
// Grille 2 lignes × 3 colonnes — max 6 slots, "+N" si dépassement

function OfferingsGrid({ offerings }) {
  const MAX = 6;
  const hasOverflow = offerings.length > MAX;
  const visible = hasOverflow ? offerings.slice(0, MAX - 1) : offerings;
  const overflow = offerings.length - (MAX - 1);

  return (
    <div className="sqp__offerings-grid">
      {visible.map((item, i) => (
        <OfferingSlot key={i} content={item} />
      ))}
      {hasOverflow && <OfferingSlot content={`+${overflow}`} isOverflow />}
    </div>
  );
}

// ─── AVATAR CARD (coin — nom + avatar uniquement) ─────────────────────────────

function AvatarCard({ participant, isMe }) {
  return (
    <div className={`sqp__avatar-card sqp__avatar-card--${participant.position}${isMe ? " sqp__avatar-card--me" : ""}`}>
      <div className="sqp__name">{participant.name}</div>
      <div className={`sqp__avatar${participant.online ? " sqp__avatar--online" : ""}`}>
        <span>{participant.avatar}</span>
        {participant.online && <div className="sqp__online-dot" />}
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

function ActionBar({ onSend, onOffrandes, onMagie, onFocus, onBlur, isFocused }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  };

  return (
    <div className={`sqp__actionbar${isFocused ? " sqp__actionbar--focused" : ""}`}>
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
//   salon        { name, emoji, gradient? }
//   onBack       () => void
//   onOffrandes  () => void
//   onMagie      () => void
//   participants  tableau de participants réels — optionnel, utilise mock si absent
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
  const [focused, setFocused] = useState(false);

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

  const isMe = (p) => p.isMe || p.id === (currentUser?.id ?? "you");

  const topLeft     = participants.find(p => p.position === "top-left");
  const topRight    = participants.find(p => p.position === "top-right");
  const bottomLeft  = participants.find(p => p.position === "bottom-left");
  const bottomRight = participants.find(p => p.position === "bottom-right");

  const salonName  = salon?.name  ?? "Café de Paris 2.0";
  const salonEmoji = salon?.emoji ?? "☕";

  return (
    <section className={`sqp${focused ? " sqp--typing" : ""}`}>
      {/* ── HEADER ── */}
      <header className="sqp__header" style={salon?.gradient ? { background: salon.gradient } : undefined}>
        <button className="sqp__back" type="button" onClick={onBack}>←</button>
        <div className="sqp__header-title">
          <span className="sqp__header-emoji">{salonEmoji}</span>
          <span className="sqp__header-name">{salonName}</span>
        </div>
        <div className="sqp__header-spacer" />
      </header>

      {/*
        ── BOARD : grille 5 colonnes × 2 lignes ──

        col1 : avatar gauche    (Sophie haut / Alex bas)
        col2 : offrandes gauche (Sophie haut / Alex bas) → pointent vers le centre
        col3 : discussion       (span sur les 2 lignes)
        col4 : offrandes droite (Emma haut / Vous bas)  → pointent vers le centre
        col5 : avatar droite    (Emma haut / Vous bas)

        Exemple visuel :
        [Sophie] [🍔🍟🌹]          [🍹🍰💌] [Emma]
                 [🍺🍰💌] DISCUSS. [      ]
        [Alex  ] [🍺🍔🌭]          [🍟☕🍫] [Vous]
                 [      ]          [      ]
      */}
      <div className="sqp__board">

        {/* ── Coins gauche ── */}
        {topLeft    && <AvatarCard participant={topLeft}    isMe={isMe(topLeft)}    />}
        {bottomLeft && <AvatarCard participant={bottomLeft} isMe={isMe(bottomLeft)} />}

        {/* ── Colonne offrandes gauche (Sophie en haut, Alex en bas) ── */}
        <div className="sqp__offrandes-col sqp__offrandes-col--left">
          <div className="sqp__offrandes-zone sqp__offrandes-zone--top">
            {topLeft?.offerings?.length > 0 && <OfferingsGrid offerings={topLeft.offerings} />}
          </div>
          <div className="sqp__offrandes-zone sqp__offrandes-zone--bottom">
            {bottomLeft?.offerings?.length > 0 && <OfferingsGrid offerings={bottomLeft.offerings} />}
          </div>
        </div>

        {/* ── Discussion centrale ── */}
        <Discussion messages={messages} />

        {/* ── Colonne offrandes droite (Emma en haut, Vous en bas) ── */}
        <div className="sqp__offrandes-col sqp__offrandes-col--right">
          <div className="sqp__offrandes-zone sqp__offrandes-zone--top">
            {topRight?.offerings?.length > 0 && <OfferingsGrid offerings={topRight.offerings} />}
          </div>
          <div className="sqp__offrandes-zone sqp__offrandes-zone--bottom">
            {bottomRight?.offerings?.length > 0 && <OfferingsGrid offerings={bottomRight.offerings} />}
          </div>
        </div>

        {/* ── Coins droite ── */}
        {topRight    && <AvatarCard participant={topRight}    isMe={isMe(topRight)}    />}
        {bottomRight && <AvatarCard participant={bottomRight} isMe={isMe(bottomRight)} />}

      </div>

      {/* ── ACTION BAR ── */}
      <ActionBar
        onSend={handleSend}
        onOffrandes={onOffrandes}
        onMagie={onMagie}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        isFocused={focused}
      />
    </section>
  );
}

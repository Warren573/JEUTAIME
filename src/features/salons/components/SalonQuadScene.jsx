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

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────

function OfferingsGrid({ items = [] }) {
  return (
    <div className="sqp-offerings-grid">
      {items.slice(0, 6).map((item, i) => (
        <div key={i} className="sqp-offering-cell">
          <span className="sqp-offering-emoji">{item}</span>
        </div>
      ))}
    </div>
  );
}

function AvatarBadge({ avatar, isSelf = false }) {
  return (
    <div className={`sqp-avatar-badge${isSelf ? " sqp-avatar-badge--self" : ""}`}>
      <div className="sqp-avatar-circle">{avatar}</div>
      <span className="sqp-online-dot" />
    </div>
  );
}

// isRight → [offrandes | avatar]  (Emma, Vous)
// !isRight → [avatar | offrandes] (Sophie, Alex)
function PlayerSlot({ participant, isMe }) {
  const isRight = participant.position.includes("right");
  return (
    <div className={`sqp-player-slot sqp-player-slot--${isRight ? "right" : "left"}${isMe ? " sqp-player-slot--me" : ""}`}>
      <div className="sqp-player-name">{participant.name}</div>
      <div className="sqp-player-row">
        {isRight && <OfferingsGrid items={participant.offerings} />}
        <AvatarBadge avatar={participant.avatar} isSelf={isMe} />
        {!isRight && <OfferingsGrid items={participant.offerings} />}
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
// Props :
//   salon        { name, emoji, gradient? }
//   onBack       () => void
//   onOffrandes  () => void
//   onMagie      () => void
//   participants  [] — optionnel, utilise mock si absent
//   currentUser  {}

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
  const [input, setInput]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [kbVisible, setKbVisible] = useState(false);
  const bottomRef = useRef(null);

  // ── 1. Verrou body.salon-lock — scoped à cet écran uniquement ─────────────
  useEffect(() => {
    document.body.classList.add("salon-lock");
    return () => document.body.classList.remove("salon-lock");
  }, []);

  // ── 2. --vvh + --keyboard-offset via visualViewport ───────────────────────
  // --vvh            : hauteur visible réelle (shrink quand clavier iOS s'ouvre)
  // --keyboard-offset: px du clavier (0 quand fermé)
  useEffect(() => {
    const updateViewportHeight = () => {
      const vv = window.visualViewport;
      const height = vv ? vv.height : window.innerHeight;
      const offset = vv ? Math.max(0, window.innerHeight - vv.height) : 0;

      document.documentElement.style.setProperty("--vvh", `${height}px`);
      document.documentElement.style.setProperty("--keyboard-offset", `${offset}px`);

      setKbVisible(offset > 150);
    };

    updateViewportHeight();
    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("scroll", updateViewportHeight);
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("scroll", updateViewportHeight);
      window.removeEventListener("resize", updateViewportHeight);
      // Nettoyer les variables CSS quand on quitte le salon
      document.documentElement.style.removeProperty("--vvh");
      document.documentElement.style.removeProperty("--keyboard-offset");
    };
  }, []);

  // ── 3. Auto-scroll vers le bas lors d'un nouveau message ──────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clavier actif = visualViewport OU focus input (fallback desktop)
  const kbMode = kbVisible || focused;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), author: currentUser?.name ?? "Vous", text: input.trim() },
    ]);
    setInput("");
  };

  const isMe = (p) => p.isMe || p.id === (currentUser?.id ?? "you");

  const tl = participants.find(p => p.position === "top-left");
  const tr = participants.find(p => p.position === "top-right");
  const bl = participants.find(p => p.position === "bottom-left");
  const br = participants.find(p => p.position === "bottom-right");

  const salonName  = salon?.name  ?? "Café de Paris 2.0";
  const salonEmoji = salon?.emoji ?? "☕";

  return (
    <div className={`sqp${kbMode ? " sqp--keyboard" : ""}`}>

      {/* ══ ZONE 1 : Header fixe ════════════════════════════════════════════ */}
      <header
        className="sqp__header"
        style={salon?.gradient ? { background: salon.gradient } : undefined}
      >
        <button className="sqp__back" type="button" onClick={onBack}>←</button>
        <span className="sqp__header-title">{salonEmoji} {salonName}</span>
      </header>

      {/* ══ ZONE 2 : Joueurs + offrandes ════════════════════════════════════
          Masqué entièrement quand le clavier s'ouvre.
          Joueurs gauche → [avatar | offrandes]
          Joueurs droite → [offrandes | avatar]
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="sqp__players" aria-hidden={kbMode}>
        <div className="sqp__players-row sqp__players-row--top">
          {tl && <PlayerSlot participant={tl} isMe={isMe(tl)} />}
          {tr && <PlayerSlot participant={tr} isMe={isMe(tr)} />}
        </div>
        <div className="sqp__players-row sqp__players-row--bottom">
          {bl && <PlayerSlot participant={bl} isMe={isMe(bl)} />}
          {br && <PlayerSlot participant={br} isMe={isMe(br)} />}
        </div>
      </div>

      {/* ══ ZONE 3 : Messages — seul élément scrollable ══════════════════════
          flex: 1 (ou grid row 1fr) → prend tout l'espace restant.
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="sqp__messages">
        {messages.map((msg) => (
          <div key={msg.id} className="sqp__message">
            <span className="sqp__msg-author">{msg.author}</span>
            <span className="sqp__msg-text">{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ══ ZONE 4 : Composer fixé en bas ════════════════════════════════════
          Input + bouton envoyer : toujours visibles.
          Boutons Offrandes / Magie : masqués si clavier.
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="sqp__composer">
        <div className="sqp__input-row">
          <input
            className="sqp__input"
            type="text"
            placeholder="Écrire un message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
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

        <div className="sqp__action-btns">
          <button className="sqp__btn sqp__btn--offrandes" type="button" onClick={onOffrandes}>
            🎁 Offrandes
          </button>
          <button className="sqp__btn sqp__btn--magie" type="button" onClick={onMagie}>
            ✨ Magie
          </button>
        </div>
      </footer>

    </div>
  );
}

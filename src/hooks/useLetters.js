/**
 * useLetters — Hook système de lettres / conversations
 *
 * Charge les conversations depuis localStorage, gère envoi de messages,
 * marquage lu/non-lu. Abstraction prête pour migration Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSessionStore } from '../store/sessionStore';

const CONVERSATIONS_KEY = (email) => `jeutaime_conversations_${email}`;
const LETTERS_KEY = (email) => `jeutaime_letters_${email}`;

export function useLetters() {
  const { currentUser } = useSessionStore();
  const [conversations, setConversations] = useState({});
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = currentUser?.email;

  const loadData = useCallback(() => {
    if (!email) {
      setConversations({});
      setLetters([]);
      setLoading(false);
      return;
    }

    // Conversations (messages par interlocuteur)
    const rawConvs = localStorage.getItem(CONVERSATIONS_KEY(email));
    setConversations(rawConvs ? JSON.parse(rawConvs) : {});

    // Liste des lettres / conversations
    const rawLetters = localStorage.getItem(LETTERS_KEY(email));
    setLetters(rawLetters ? JSON.parse(rawLetters) : []);

    setLoading(false);
  }, [email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Envoie un message à un interlocuteur.
   */
  const sendMessage = (recipientEmail, text) => {
    if (!email || !text.trim()) return false;

    const key = CONVERSATIONS_KEY(email);
    const convs = JSON.parse(localStorage.getItem(key) || '{}');
    if (!convs[recipientEmail]) convs[recipientEmail] = [];

    convs[recipientEmail].push({
      id: Date.now(),
      from: email,
      to: recipientEmail,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    });

    localStorage.setItem(key, JSON.stringify(convs));
    setConversations({ ...convs });
    return true;
  };

  /**
   * Marque tous les messages d'une conversation comme lus.
   */
  const markRead = (recipientEmail) => {
    if (!email) return;

    const key = CONVERSATIONS_KEY(email);
    const convs = JSON.parse(localStorage.getItem(key) || '{}');
    if (convs[recipientEmail]) {
      convs[recipientEmail] = convs[recipientEmail].map(m =>
        m.to === email ? { ...m, read: true } : m
      );
      localStorage.setItem(key, JSON.stringify(convs));
      setConversations({ ...convs });
    }
  };

  /**
   * Retourne les messages d'une conversation avec un interlocuteur.
   */
  const getConversation = (recipientEmail) => {
    return conversations[recipientEmail] || [];
  };

  /**
   * Compte le nombre de messages non lus au total.
   */
  const unreadCount = Object.values(conversations).reduce((total, msgs) => {
    return total + msgs.filter(m => m.to === email && !m.read).length;
  }, 0);

  return {
    letters,
    conversations,
    loading,
    unreadCount,
    sendMessage,
    markRead,
    getConversation,
    refresh: loadData,
  };
}

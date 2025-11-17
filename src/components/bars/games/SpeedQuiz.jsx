import React, { useState, useEffect } from 'react';

// Base de questions
const quizQuestions = [
  {
    id: 1,
    question: 'Quelle appli est la PIRE pour draguer ?',
    answers: ['Tinder', 'LinkedIn', 'Leboncoin', 'Doctolib'],
    correct: 1,
    category: 'fun'
  },
  {
    id: 2,
    question: 'Premier signe qu\'un date va mal ?',
    answers: ['Il regarde son phone', 'Il parle de son ex', 'Il commande l\'eau du robinet', 'Il propose de splitter l\'addition'],
    correct: 1,
    category: 'dating'
  },
  {
    id: 3,
    question: 'Meilleure excuse pour annuler un date ?',
    answers: ['Ma grand-mère est morte', 'J\'ai chopé la gastro', 'Je dois laver mon chat', 'Coupure internet'],
    correct: 1,
    category: 'fun'
  },
  {
    id: 4,
    question: 'Red flag ultime sur un profil :',
    answers: ['Photo de groupe uniquement', 'Bio vide', '15 photos de sa voiture', 'Pseudo "CélibDu93"'],
    correct: 2,
    category: 'dating'
  },
  {
    id: 5,
    question: 'Combien de temps avant le 1er texto ?',
    answers: ['Tout de suite', '2-3 heures', 'Le lendemain', 'Jamais, attends'],
    correct: 2,
    category: 'dating'
  },
  {
    id: 6,
    question: 'Pire question sur un 1er rendez-vous :',
    answers: ['"T\'es vierge?"', '"Tu veux combien d\'enfants?"', '"Combien tu gagnes?"', '"T\'habites chez tes parents?"'],
    correct: 1,
    category: 'dating'
  },
  {
    id: 7,
    question: 'Quel emoji détruit une conversation ?',
    answers: ['🍆', '😂', '👍', '🙏'],
    correct: 2,
    category: 'fun'
  },
  {
    id: 8,
    question: 'Durée idéale d\'un 1er date :',
    answers: ['30 minutes', '1-2 heures', '4-5 heures', 'Toute la nuit'],
    correct: 1,
    category: 'dating'
  },
  {
    id: 9,
    question: 'Moment où tu sais que c\'est mort :',
    answers: ['Pas de 2e verre proposé', 'Check son téléphone 10 fois', '"On reste amis?"', 'Baille pendant que tu parles'],
    correct: 2,
    category: 'fun'
  },
  {
    id: 10,
    question: 'Pire mensonge sur ton profil ?',
    answers: ['Taille +10cm', 'Âge -5 ans', 'Photos d\'il y a 10 ans', 'Profession inventée'],
    correct: 2,
    category: 'dating'
  },
  {
    id: 11,
    question: 'Quand envoyer le nude ?',
    answers: ['Jamais', 'Après 1 mois', 'Dès le match', 'Quand on demande'],
    correct: 0,
    category: 'dating'
  },
  {
    id: 12,
    question: 'Pire opening line sur une app ?',
    answers: ['"Salut"', '"T\'es chaude?"', '"Cc bb"', '"Nudes?"'],
    correct: 3,
    category: 'fun'
  },
  {
    id: 13,
    question: 'Date qui finit en friendzone :',
    answers: ['Cinéma', 'Café', 'Restaurant', 'Parc'],
    correct: 1,
    category: 'dating'
  },
  {
    id: 14,
    question: 'Il/elle est pas intéressé(e) si :',
    answers: ['Répond en 1 mot', 'Pose pas de questions', 'Dit "mdr" à tout', 'Tout ça'],
    correct: 3,
    category: 'dating'
  },
  {
    id: 15,
    question: 'Meilleur plan pour un 2e date ?',
    answers: ['Resto gastro', 'Bar à cocktails', 'Activité fun', 'Netflix chez toi'],
    correct: 2,
    category: 'dating'
  }
];

export default function SpeedQuiz({ onClose, currentUser }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const totalQuestions = 10;

  // Charger la première question
  useEffect(() => {
    loadQuestion();
  }, []);

  // Timer
  useEffect(() => {
    if (timer > 0 && !showResult && !gameOver) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !showResult) {
      // Temps écoulé
      handleTimeout();
    }
  }, [timer, showResult, gameOver]);

  const loadQuestion = () => {
    if (questionIndex >= totalQuestions) {
      setGameOver(true);
      return;
    }

    const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setTimer(10);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleTimeout = () => {
    setShowResult(true);
    setStreak(0);

    setTimeout(() => {
      setQuestionIndex(i => i + 1);
      loadQuestion();
    }, 2000);
  };

  const handleAnswer = (answerIndex) => {
    if (showResult || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correct;

    if (isCorrect) {
      const timeBonus = timer * 2;
      const streakBonus = streak * 5;
      const points = 10 + timeBonus + streakBonus;
      setScore(s => s + points);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setShowResult(true);

    setTimeout(() => {
      if (questionIndex + 1 >= totalQuestions) {
        setGameOver(true);
      } else {
        setQuestionIndex(i => i + 1);
        loadQuestion();
      }
    }, 1500);
  };

  if (gameOver) {
    const rank = score >= 150 ? '🏆 Expert' : score >= 100 ? '🥇 Pro' : score >= 50 ? '🥈 Pas mal' : '🥉 Débutant';

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '15px' }}>
          Quiz terminé !
        </h2>
        <div style={{
          background: '#1a1a1a',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '48px', fontWeight: '700', color: '#4CAF50', marginBottom: '10px' }}>
            {score} pts
          </div>
          <div style={{ fontSize: '24px', marginBottom: '15px' }}>
            {rank}
          </div>
          <div style={{ fontSize: '14px', color: '#888' }}>
            {questionIndex} questions • {Math.round((score / (questionIndex * 20)) * 100)}% de réussite
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #E91E63, #C2185B)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Fermer
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>⚡ Speed Quiz</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
            Question {questionIndex + 1}/{totalQuestions} • Score: {score}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#333',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 15px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
          color: 'white',
          padding: '10px',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: '14px',
          fontWeight: '700'
        }}>
          🔥 Série de {streak} ! +{streak * 5} bonus
        </div>
      )}

      {/* Timer */}
      <div style={{
        background: timer <= 3 ? '#dc3545' : '#2196F3',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '32px',
        fontWeight: '700',
        animation: timer <= 3 ? 'pulse 0.5s infinite' : 'none'
      }}>
        ⏱️ {timer}s
      </div>

      {/* Question */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        textAlign: 'center',
        border: '2px solid #2196F3'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          lineHeight: '1.5'
        }}>
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correct;
          const showCorrectness = showResult;

          let background = '#1a1a1a';
          let border = '1px solid #333';

          if (showCorrectness) {
            if (isCorrect) {
              background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
              border = '2px solid #4CAF50';
            } else if (isSelected && !isCorrect) {
              background = 'linear-gradient(135deg, #dc3545, #c82333)';
              border = '2px solid #dc3545';
            }
          } else if (isSelected) {
            background = 'linear-gradient(135deg, #2196F3, #1976D2)';
            border = '2px solid #2196F3';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              style={{
                background,
                border,
                borderRadius: '12px',
                padding: '18px 15px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: showResult ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                {String.fromCharCode(65 + index)}
              </div>
              <div style={{ flex: 1 }}>{answer}</div>
              {showCorrectness && isCorrect && <div style={{ fontSize: '20px' }}>✓</div>}
              {showCorrectness && isSelected && !isCorrect && <div style={{ fontSize: '20px' }}>✗</div>}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';

export default function QuestionGame({ currentUser, matchedUser, onMatchSuccess, onMatchFail }) {
  const [step, setStep] = useState(1); // 1 = answer questions, 2 = waiting for other, 3 = results
  const [userAnswers, setUserAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });

  const matchedUserQuestions = matchedUser?.question1 ? [
    matchedUser.question1,
    matchedUser.question2,
    matchedUser.question3
  ] : null;

  if (!matchedUserQuestions || !matchedUserQuestions[0].text) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          background: '#1a1a1a',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
          border: '2px solid #E91E63'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>❌ Erreur</h2>
          <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '20px' }}>
            {matchedUser.name} n'a pas encore créé ses 3 questions.
          </p>
          <button
            onClick={onMatchFail}
            style={{
              width: '100%',
              padding: '15px',
              background: '#E91E63',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitAnswers = () => {
    // Check if all answers are provided
    if (!userAnswers.q1 || !userAnswers.q2 || !userAnswers.q3) {
      alert('Réponds aux 3 questions !');
      return;
    }

    // Calculate score
    let score = 0;
    if (userAnswers.q1 === matchedUserQuestions[0].correctAnswer) score++;
    if (userAnswers.q2 === matchedUserQuestions[1].correctAnswer) score++;
    if (userAnswers.q3 === matchedUserQuestions[2].correctAnswer) score++;

    // For now, simulate that the other person also answered
    // In a real app, this would wait for the other person
    const otherPersonScore = Math.floor(Math.random() * 3) + 1; // Random 1-3 for demo

    // Check if match is successful (at least 1 good answer on each side)
    if (score >= 1 && otherPersonScore >= 1) {
      // SUCCESS!
      setTimeout(() => {
        alert(`🎉 Match réussi ! Tu as ${score}/3 bonnes réponses et ${matchedUser.name} a ${otherPersonScore}/3 !`);
        onMatchSuccess(matchedUser, score, otherPersonScore);
      }, 500);
    } else {
      // FAIL
      setTimeout(() => {
        alert(`😔 Pas de match... Tu as ${score}/3 et ${matchedUser.name} a ${otherPersonScore}/3. Il faut au moins 1 bonne réponse de chaque côté.`);
        onMatchFail();
      }, 500);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '10px', textAlign: 'center', color: 'white' }}>
          💞 Sourire Mutuel !
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
          Réponds aux 3 questions de {matchedUser.name}
        </p>

        {/* Question 1 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          color: '#333'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#667eea' }}>
            Question 1
          </h3>
          <p style={{ fontSize: '15px', marginBottom: '15px', fontWeight: '600' }}>
            {matchedUserQuestions[0].text}
          </p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {['A', 'B', 'C'].map(letter => (
              <button
                key={letter}
                onClick={() => setUserAnswers({ ...userAnswers, q1: letter })}
                style={{
                  padding: '12px',
                  background: userAnswers.q1 === letter ? '#667eea' : '#f5f5f5',
                  border: userAnswers.q1 === letter ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: '10px',
                  color: userAnswers.q1 === letter ? 'white' : '#333',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: userAnswers.q1 === letter ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                <strong>{letter}.</strong> {matchedUserQuestions[0][`answer${letter}`]}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          color: '#333'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#764ba2' }}>
            Question 2
          </h3>
          <p style={{ fontSize: '15px', marginBottom: '15px', fontWeight: '600' }}>
            {matchedUserQuestions[1].text}
          </p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {['A', 'B', 'C'].map(letter => (
              <button
                key={letter}
                onClick={() => setUserAnswers({ ...userAnswers, q2: letter })}
                style={{
                  padding: '12px',
                  background: userAnswers.q2 === letter ? '#764ba2' : '#f5f5f5',
                  border: userAnswers.q2 === letter ? '2px solid #764ba2' : '2px solid #ddd',
                  borderRadius: '10px',
                  color: userAnswers.q2 === letter ? 'white' : '#333',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: userAnswers.q2 === letter ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                <strong>{letter}.</strong> {matchedUserQuestions[1][`answer${letter}`]}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          color: '#333'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#f093fb' }}>
            Question 3
          </h3>
          <p style={{ fontSize: '15px', marginBottom: '15px', fontWeight: '600' }}>
            {matchedUserQuestions[2].text}
          </p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {['A', 'B', 'C'].map(letter => (
              <button
                key={letter}
                onClick={() => setUserAnswers({ ...userAnswers, q3: letter })}
                style={{
                  padding: '12px',
                  background: userAnswers.q3 === letter ? '#f093fb' : '#f5f5f5',
                  border: userAnswers.q3 === letter ? '2px solid #f093fb' : '2px solid #ddd',
                  borderRadius: '10px',
                  color: userAnswers.q3 === letter ? 'white' : '#333',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: userAnswers.q3 === letter ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                <strong>{letter}.</strong> {matchedUserQuestions[2][`answer${letter}`]}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitAnswers}
          style={{
            width: '100%',
            padding: '18px',
            background: 'white',
            border: 'none',
            borderRadius: '15px',
            color: '#667eea',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          ✅ Valider mes réponses
        </button>
      </div>
    </div>
  );
}

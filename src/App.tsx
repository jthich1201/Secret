import { useEffect, useState } from 'react';
import './App.css';

const goals = [
  'Go to Seattle', 'Go to San Diego', 'Pass boarding exam', 'Start a new hobby', 'Do something new',
  'Take a solo trip', 'Try a new food', 'Visit a new place', 'Learn a new skill', 'Go to a concert',
  'Make a new friend', 'Reach a personal goal', 'FREE SPACE', 'Finish a bucket-list item', 'Try a new activity',
  'Get a new achievement', 'Have a memorable day', 'Go on an adventure', 'Read a new book', 'Improve at a hobby',
  'Save up for something', 'Leave your comfort zone', 'Celebrate a milestone', 'Make a new memory', 'Do something independently',
];

const STORAGE_KEY = 'bingo-progress';

function readSaved(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [12];
    if (!Array.isArray(value)) return [12];
    return [...new Set([
      ...value.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 25),
      12,
    ])];
  } catch {
    return [12];
  }
}

export default function App() {
  const [completed, setCompleted] = useState<number[]>(readSaved);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const toggle = (id: number) => {
    if (id === 12) return;
    setCompleted(current =>
      current.includes(id) ? current.filter(n => n !== id) : [...current, id]
    );
  };

  const count = completed.length - 1;
  const progress = Math.round((count / 25) * 100);

  return (
    <main className="page">
      <div className="artboard">
        <img
          className="reference-art"
          src="/bingo-reference.png"
          alt="Katherine's pastel character bingo board"
          draggable="false"
        />

        <div className="tile-grid" aria-label="Interactive bingo board">
          {goals.map((goal, id) => {
            const isDone = completed.includes(id);
            return (
              <button
                key={goal}
                type="button"
                className={`tile-hitbox ${isDone ? 'is-done' : ''} ${id === 12 ? 'is-free' : ''}`}
                onClick={() => toggle(id)}
                aria-pressed={isDone}
                aria-label={`${goal}${isDone ? ', completed' : ''}`}
                title={goal}
              >
                {isDone && id !== 12 ? <span className="checkmark" aria-hidden="true">✓</span> : null}
              </button>
            );
          })}
        </div>

        <div className="footer-controls">
          <div className="live-count" aria-live="polite">☆ {count} / 25 completed</div>
          <div
            className="live-progress"
            role="progressbar"
            aria-label="Bingo progress"
            aria-valuemin={0}
            aria-valuemax={25}
            aria-valuenow={count}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="live-reset">
            {!confirmReset ? (
              <button type="button" onClick={() => setConfirmReset(true)}>↻ Reset</button>
            ) : (
              <div className="confirm-buttons">
                <button type="button" onClick={() => { setCompleted([12]); setConfirmReset(false); }}>Confirm</button>
                <button type="button" onClick={() => setConfirmReset(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="hint">♡ Click a square to mark it complete — your progress saves automatically. ♡</p>
    </main>
  );
}

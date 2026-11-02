
import { useEffect, useState } from 'react';
import './App.css';

const goals = [
  'Go to Seattle',
  'Go to San Diego',
  'Pass boarding exam',
  'Start a new hobby',
  'Do something new',
  'Take a solo trip',
  'Try a new food',
  'Visit a new place',
  'Learn a new skill',
  'Go to a concert',
  'Make a new friend',
  'Reach a personal goal',
  'FREE SPACE',
  'Finish a bucket-list item',
  'Try a new activity',
  'Get a new achievement',
  'Have a memorable day',
  'Go on an adventure',
  'Read a new book',
  'Improve at a hobby',
  'Save up for something',
  'Leave your comfort zone',
  'Celebrate a milestone',
  'Make a new memory',
  'Do something independently',
];

type TilePosition = {
  left: number;
  top: number;
  width: number;
  height: number;
};



const tilePositions: TilePosition[] = [
  // Row 1
  { left: 14, top: 20.5, width: 14, height: 13.8 },
  { left: 28.6, top: 20.5, width: 14, height: 13.8  },
  { left: 43.25, top: 20.5, width: 14, height: 13.8  },
  { left: 57.46, top: 20.5, width: 14, height: 13.8  },
  { left: 72., top: 20, width: 14, height: 13.8  },

  // Row 2
  { left: 14, top: 34.44, width: 14, height: 13.8  },
  { left: 28.9, top: 34.44, width: 13.7, height: 13.8  },
  { left: 43.25, top: 34.44, width: 14, height: 13.8 },
  { left: 57.46, top: 34.44, width: 14, height: 13.8 },
  { left: 72., top: 34.9, width: 14, height: 13.8 },

  // Row 3
  { left: 14.12, top: 49.9, width: 13.89, height: 13.5 },
  { left: 28.67, top: 49.9, width: 13.89, height: 13.5 },
  { left: 43.25, top: 49.9, width: 13.89, height: 13.5 },
  { left: 57.46, top: 49.9, width: 13.89, height: 13.5 },
  { left: 72.1, top: 49.3, width: 13.89, height: 13.5},

  // Row 4
  { left: 14., top: 63.62, width: 14, height: 14 },
  { left: 28.6, top: 63.62, width: 13.8, height: 14 },
  { left: 43.25, top: 63.62, width: 13.7, height: 14 },
  { left: 57.46, top: 63.62, width: 14, height: 14 },
  { left: 72.2, top: 64.1, width: 13.8, height: 13.8 },

  // Row 5
  { left: 14.2, top: 78.8, width: 13.8, height: 13.6 },
  { left: 28.7, top: 78.8, width: 13.7, height: 13.6 },
  { left: 43.25, top: 78.8, width: 13.7, height: 13.6 },
  { left: 57.46, top: 78.8, width: 14, height: 13.6 },
  { left: 72, top: 78.8, width: 14, height: 13.6 },
];


const STORAGE_KEY = 'bingo-progress';
const MEMORY_KEY = 'bingo-memories';

type Memory = {
  note: string;
  date: string;
  photo: string;
};

const emptyMemory = (): Memory => ({
  note: '',
  date: new Date().toLocaleDateString('en-CA'),
  photo: '',
});

function readSaved(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [12];

    if (!Array.isArray(value)) return [12];

    return [
      ...new Set([
        ...value.filter(
          (n): n is number =>
            Number.isInteger(n) && n >= 0 && n < 25,
        ),
        12,
      ]),
    ];
  } catch {
    return [12];
  }
}

function readMemories(): Record<number, Memory> {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const badges = [
  {
    threshold: 1,
    icon: '🌱',
    name: 'First Step',
    description: 'Complete your first goal!',
  },
  {
    threshold: 5,
    icon: '🎀',
    name: 'Getting Started',
    description: 'Complete 5 goals!',
  },
  {
    threshold: 12,
    icon: '⭐',
    name: 'Halfway There',
    description: 'Complete 12 goals!',
  },
  {
    threshold: 24,
    icon: '🏆',
    name: 'Bingo Master',
    description: 'Complete all 24 goals!',
  },
];

export default function App() {
  const [completed, setCompleted] = useState<number[]>(readSaved);
  const [memories, setMemories] =
    useState<Record<number, Memory>>(readMemories);
  const [confirmReset, setConfirmReset] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Memory>(emptyMemory);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(memories));
    } catch {
      setNotice('Storage is full. Try removing a large photo.');
    }
  }, [memories]);

  const count = completed.filter(id => id !== 12).length;
  const progress = Math.round((count / 24) * 100);

  const openJournal = (id: number) => {
    if (id === 12) return;

    setDraft({
      ...emptyMemory(),
      ...(memories[id] || {}),
    });

    setNotice('');
    setSelectedId(id);
  };

  const saveMemory = () => {
    if (selectedId === null) return;

    setMemories(current => ({
      ...current,
      [selectedId]: { ...draft },
    }));

    setNotice('Memory saved! ♡');
  };

  const toggleComplete = () => {
    if (selectedId === null) return;

    setMemories(current => ({
      ...current,
      [selectedId]: { ...draft },
    }));

    setCompleted(current =>
      current.includes(selectedId)
        ? current.filter(id => id !== selectedId)
        : [...current, selectedId],
    );

    setSelectedId(null);
  };

  const uploadPhoto = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Please choose an image file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const source = new Image();

      source.onload = () => {
        const maxSide = 900;
        const scale = Math.min(
          1,
          maxSide / Math.max(source.width, source.height),
        );

        const canvas = document.createElement('canvas');

        canvas.width = Math.round(source.width * scale);
        canvas.height = Math.round(source.height * scale);

        const context = canvas.getContext('2d');

        if (!context) {
          setNotice('Could not process this photo.');
          return;
        }

        context.drawImage(
          source,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        setDraft(current => ({
          ...current,
          photo: canvas.toDataURL('image/jpeg', 0.75),
        }));

        setNotice('');
      };

      source.onerror = () => {
        setNotice('Could not load this photo.');
      };

      source.src = String(reader.result);
    };

    reader.onerror = () => {
      setNotice('Could not read this photo.');
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="page">
      <div className="artboard">
        <img
          className="reference-art"
          src={`${import.meta.env.BASE_URL}bingo-reference.png`}
          alt="Katherine's pastel character bingo board"
          draggable="false"
        />

        {goals.map((goal, id) => {
          const isDone = completed.includes(id);
          const pos = tilePositions[id];

          return (
            <button
              key={goal}
              type="button"
              className={`tile-hitbox ${
                isDone ? 'is-done' : ''
              } ${id === 12 ? 'is-free' : ''}`}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                width: `${pos.width}%`,
                height: `${pos.height}%`,
              }}
              onClick={() => openJournal(id)}
              aria-pressed={isDone}
              aria-label={`Open journal for ${goal}${
                isDone ? ', completed' : ''
              }`}
              title={
                id === 12
                  ? 'Free space'
                  : `Open memory: ${goal}`
              }
            >
              {isDone && id !== 12 && (
                <span className="checkmark" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}

        <div className="footer-controls">
          <div className="live-count" aria-live="polite">
            ☆ {count} / 24 completed
          </div>

          <div
            className="live-progress"
            role="progressbar"
            aria-label="Bingo progress"
            aria-valuemin={0}
            aria-valuemax={24}
            aria-valuenow={count}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="live-reset">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
              >
                ↻ Reset
              </button>
            ) : (
              <div className="confirm-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setCompleted([12]);
                    setConfirmReset(false);
                  }}
                >
                  Confirm
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="hint">
        ♡ Click a square to open its memory journal. Your progress
        saves automatically. ♡
      </p>

      <section className="achievement-section">
        <h2>♡ My Achievements ♡</h2>

        <p className="achievement-subtitle">
          Every little step deserves a celebration!
        </p>

        <div className="badge-collection">
          {badges.map(badge => {
            const unlocked = count >= badge.threshold;

            return (
              <div
                key={badge.name}
                className={`achievement-badge ${
                  unlocked ? 'unlocked' : 'locked'
                }`}
                aria-label={`${badge.name}: ${
                  unlocked ? 'unlocked' : 'locked'
                }`}
              >
                <div className="badge-sticker">
                  {unlocked ? badge.icon : '🔒'}
                </div>

                <h3>{badge.name}</h3>

                <p>
                  {unlocked
                    ? badge.description
                    : `Unlock at ${badge.threshold} goals`}
                </p>

                <span className="badge-status">
                  {unlocked ? '✧ Unlocked! ✧' : 'Not yet ♡'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {selectedId !== null && (
        <div
          className="journal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setSelectedId(null);
            }
          }}
        >
          <section
            className="journal-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-title"
          >
            <button
              className="journal-close"
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close journal"
            >
              ×
            </button>

            <div className="journal-decoration">
              🎀 ✧ ♡ ✧ 🎀
            </div>

            <h2 id="journal-title">My Little Memory</h2>
            <h3>{goals[selectedId]}</h3>

            <p className="journal-subtitle">
              Every little adventure is worth remembering.
            </p>

            <label className="journal-label" htmlFor="memory-date">
              When did it happen?
            </label>

            <input
              id="memory-date"
              type="date"
              value={draft.date}
              onChange={event =>
                setDraft(current => ({
                  ...current,
                  date: event.target.value,
                }))
              }
            />

            <label className="journal-label" htmlFor="memory-note">
              Write about your memory ♡
            </label>

            <textarea
              id="memory-note"
              rows={4}
              placeholder="What happened? How did it make you feel?"
              value={draft.note}
              onChange={event =>
                setDraft(current => ({
                  ...current,
                  note: event.target.value,
                }))
              }
            />

            <label className="journal-label" htmlFor="memory-photo">
              Add a photo (optional)
            </label>

            <input
              id="memory-photo"
              type="file"
              accept="image/*"
              onChange={event =>
                uploadPhoto(event.target.files?.[0])
              }
            />

            {draft.photo && (
              <div className="memory-photo-preview">
                <img
                  src={draft.photo}
                  alt="Your saved memory"
                />

                <button
                  type="button"
                  onClick={() =>
                    setDraft(current => ({
                      ...current,
                      photo: '',
                    }))
                  }
                >
                  Remove photo
                </button>
              </div>
            )}

            {notice && (
              <p className="journal-notice" aria-live="polite">
                {notice}
              </p>
            )}

            <button
              className="journal-save"
              type="button"
              onClick={saveMemory}
            >
              Save Memory ♡
            </button>

            <button
              className="journal-complete"
              type="button"
              onClick={toggleComplete}
            >
              {completed.includes(selectedId)
                ? '✓ Mark as not completed'
                : '♡ Mark Complete!'}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

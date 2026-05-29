import { useState, useCallback, useRef } from 'react';

const CATEGORY_KEYWORDS = {
  Food: ['food', 'eat', 'lunch', 'dinner', 'breakfast', 'snack', 'restaurant', 'hotel', 'சாப்பாடு', 'உணவு', 'தண்ணீர்'],
  Shopping: ['shop', 'shopping', 'buy', 'purchase', 'market', 'கடை', 'வாங்க'],
  Bills: ['bill', 'electricity', 'water', 'gas', 'phone', 'internet', 'rent', 'மின்சாரம்', 'கட்டணம்'],
  Travel: ['travel', 'bus', 'train', 'auto', 'taxi', 'petrol', 'fuel', 'பயணம்', 'பஸ்'],
  Medical: ['medical', 'doctor', 'medicine', 'hospital', 'pharmacy', 'மருந்து', 'மருத்துவமனை'],
  Education: ['school', 'college', 'fee', 'book', 'education', 'பள்ளி', 'கல்வி'],
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'Other';
}

function parseVoiceInput(transcript) {
  // Patterns: "Food 500", "500 food", "spent 200 on bills", "நூறு food"
  const numberWords = { 'நூறு': 100, 'இருநூறு': 200, 'ஐந்நூறு': 500, 'ஆயிரம்': 1000 };
  let text = transcript;
  for (const [word, num] of Object.entries(numberWords)) {
    text = text.replace(new RegExp(word, 'g'), num.toString());
  }
  const match = text.match(/(\d+(?:\.\d+)?)/);
  const amount = match ? parseFloat(match[1]) : null;
  const category = detectCategory(text);
  const wordsWithoutNumber = text.replace(/\d+(?:\.\d+)?/g, '').replace(/\s+/g, ' ').trim();
  const title = wordsWithoutNumber || `${category} expense`;
  return { amount, category, title: title.charAt(0).toUpperCase() + title.slice(1) };
}

export function useVoice({ onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const startListening = useCallback((lang = 'ta-IN') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input not supported in this browser. Use Chrome.');
      return;
    }
    setError('');
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      setIsListening(false);
      setError(e.error === 'no-speech' ? 'No speech detected. Try again.' : `Error: ${e.error}`);
    };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const parsed = parseVoiceInput(text);
      if (onResult) onResult(parsed, text);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, error, startListening, stopListening };
}

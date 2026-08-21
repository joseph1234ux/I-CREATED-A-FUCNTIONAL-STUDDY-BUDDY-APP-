export const mascots = [
  { id: 'book', name: 'Bookish', emoji: '📖', colors: ['#E50914', '#8B5CF6', '#4F46E5'] },
  { id: 'fox', name: 'Foxy', emoji: '🦊', colors: ['#F97316', '#FB923C', '#FDBA74'] },
  { id: 'cat', name: 'Whiskers', emoji: '🐈', colors: ['#6B7280', '#9CA3AF', '#D1D5DB'] },
  { id: 'owl', name: 'Owlbert', emoji: '🦉', colors: ['#7C3AED', '#8B5CF6', '#A78BFA'] },
  { id: 'writer', name: 'Penelope', emoji: '✍️', colors: ['#1F2937', '#374151', '#4B5563'] },
  { id: 'mystery', name: 'Shadow', emoji: '🕵️', colors: ['#1E1B4B', '#312E81', '#4F46E5'] },
  { id: 'fantasy', name: 'Astra', emoji: '🌙', colors: ['#0EA5E9', '#38BDF8', '#7DD3FC'] },
  { id: 'dragon', name: 'Ember', emoji: '🐉', colors: ['#DC2626', '#EF4444', '#F87171'] }
];

export const getRandomMascot = (seed) => {
  const index = seed ? Math.abs(seed) % mascots.length : Math.floor(Math.random() * mascots.length);
  return mascots[index];
};

export const generateMascotSVG = (mascot, size = 80) => {
  const emojiSize = Math.floor(size * 0.55);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${mascot.colors[0]}" />
        <stop offset="100%" style="stop-color:${mascot.colors[1]}" />
      </linearGradient>
      <radialGradient id="glow" cx="30%" cy="30%">
        <stop offset="0%" style="stop-color:${mascot.colors[2]};stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:${mascot.colors[1]};stop-opacity:0" />
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#glow)"/>
    <text x="${size/2}" y="${size/2 + emojiSize * 0.35}" font-size="${emojiSize}" text-anchor="middle" dominant-baseline="central">${mascot.emoji}</text>
    <rect x="${size * 0.05}" y="${size * 0.05}" width="${size * 0.9}" height="${size * 0.9}" rx="${size * 0.15}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="${size * 0.02}"/>
  </svg>`;
};
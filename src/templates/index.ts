import type { Template, Slide, TextElement } from '../types';

function id(): string {
  return Math.random().toString(36).substring(2, 10);
}

function textEl(overrides: Partial<TextElement> & { text: string }): TextElement {
  return {
    id: id(),
    type: 'text',
    x: 100,
    y: 400,
    width: 880,
    height: 100,
    angle: 0,
    fontSize: 64,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fill: '#ffffff',
    textAlign: 'center',
    lineHeight: 1.2,
    ...overrides,
  };
}

function slide(bg: string, elements: TextElement[]): Slide {
  return { id: id(), backgroundColor: bg, elements };
}

export const templates: Template[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    thumbnail: '',
    aspectRatio: '1:1',
    slides: [
      slide('#1a1a2e', [
        textEl({ text: 'Your Title Here', y: 350, fontSize: 72 }),
        textEl({ text: 'Swipe to learn more →', y: 500, fontSize: 32, fontWeight: 'normal', fill: '#a0a0c0' }),
      ]),
      slide('#16213e', [
        textEl({ text: 'Key Point #1', y: 300, fontSize: 56 }),
        textEl({ text: 'Add your explanation here. Keep it concise and impactful.', y: 450, fontSize: 28, fontWeight: 'normal', fill: '#c0c0e0' }),
      ]),
      slide('#0f3460', [
        textEl({ text: 'Key Point #2', y: 300, fontSize: 56 }),
        textEl({ text: 'Another insight that your audience needs to know.', y: 450, fontSize: 28, fontWeight: 'normal', fill: '#c0c0e0' }),
      ]),
      slide('#e94560', [
        textEl({ text: 'Follow for More', y: 400, fontSize: 64 }),
        textEl({ text: '@yourusername', y: 520, fontSize: 36, fontWeight: 'normal' }),
      ]),
    ],
  },
  {
    id: 'bold-gradient',
    name: 'Bold Gradient',
    thumbnail: '',
    aspectRatio: '1:1',
    slides: [
      slide('#667eea', [
        textEl({ text: '5 Tips for Success', y: 300, fontSize: 72, fontFamily: 'Montserrat' }),
        textEl({ text: 'A thread →', y: 480, fontSize: 36, fontWeight: 'normal', fontFamily: 'Montserrat' }),
      ]),
      slide('#764ba2', [
        textEl({ text: 'Tip #1', y: 200, fontSize: 48, fontFamily: 'Montserrat' }),
        textEl({ text: 'Start with a clear goal. Know what you want to achieve before you begin.', y: 350, fontSize: 32, fontWeight: 'normal', fontFamily: 'Montserrat' }),
      ]),
      slide('#f093fb', [
        textEl({ text: 'Tip #2', y: 200, fontSize: 48, fontFamily: 'Montserrat', fill: '#1a1a2e' }),
        textEl({ text: 'Consistency beats intensity. Show up every single day.', y: 350, fontSize: 32, fontWeight: 'normal', fontFamily: 'Montserrat', fill: '#2a2a4e' }),
      ]),
    ],
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    thumbnail: '',
    aspectRatio: '1:1',
    slides: [
      slide('#ffffff', [
        textEl({ text: 'Did You Know?', y: 350, fontSize: 72, fill: '#1a1a1a', fontFamily: 'Playfair Display' }),
        textEl({ text: 'Swipe for the answer →', y: 500, fontSize: 28, fontWeight: 'normal', fill: '#888888', fontFamily: 'Inter' }),
      ]),
      slide('#f8f8f8', [
        textEl({ text: 'The Answer', y: 300, fontSize: 56, fill: '#1a1a1a', fontFamily: 'Playfair Display' }),
        textEl({ text: 'Add your fascinating fact or answer here. Make it memorable.', y: 450, fontSize: 28, fontWeight: 'normal', fill: '#555555', fontFamily: 'Inter' }),
      ]),
      slide('#ffffff', [
        textEl({ text: 'Save This Post!', y: 400, fontSize: 56, fill: '#1a1a1a', fontFamily: 'Playfair Display' }),
      ]),
    ],
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    thumbnail: '',
    aspectRatio: '4:5',
    slides: [
      slide('#2c1810', [
        textEl({ text: 'Natural Living', y: 450, fontSize: 72, fontFamily: 'Lora', fill: '#e8d5b7' }),
        textEl({ text: 'A guide to sustainable choices', y: 600, fontSize: 28, fontWeight: 'normal', fontFamily: 'Lora', fill: '#b8a58a' }),
      ]),
      slide('#3d2415', [
        textEl({ text: 'Step One', y: 350, fontSize: 56, fontFamily: 'Lora', fill: '#e8d5b7' }),
        textEl({ text: 'Start by reducing single-use plastics in your daily routine.', y: 500, fontSize: 28, fontWeight: 'normal', fontFamily: 'Lora', fill: '#b8a58a' }),
      ]),
    ],
  },
  {
    id: 'neon-dark',
    name: 'Neon Dark',
    thumbnail: '',
    aspectRatio: '1:1',
    slides: [
      slide('#0a0a0a', [
        textEl({ text: 'BREAKING NEWS', y: 300, fontSize: 80, fontFamily: 'Oswald', fill: '#00ff88' }),
        textEl({ text: 'Something amazing just happened', y: 480, fontSize: 32, fontWeight: 'normal', fontFamily: 'Inter', fill: '#ffffff' }),
      ]),
      slide('#0a0a0a', [
        textEl({ text: 'THE DETAILS', y: 300, fontSize: 56, fontFamily: 'Oswald', fill: '#ff0088' }),
        textEl({ text: 'Share the full story here with your audience.', y: 450, fontSize: 28, fontWeight: 'normal', fontFamily: 'Inter', fill: '#cccccc' }),
      ]),
      slide('#0a0a0a', [
        textEl({ text: 'SHARE THIS', y: 400, fontSize: 72, fontFamily: 'Oswald', fill: '#00aaff' }),
      ]),
    ],
  },
  {
    id: 'pastel-soft',
    name: 'Pastel Soft',
    thumbnail: '',
    aspectRatio: '1:1',
    slides: [
      slide('#fce4ec', [
        textEl({ text: 'Self-Care Sunday', y: 350, fontSize: 64, fontFamily: 'Raleway', fill: '#4a2040' }),
        textEl({ text: '5 ways to recharge this weekend', y: 490, fontSize: 28, fontWeight: 'normal', fontFamily: 'Raleway', fill: '#7a5070' }),
      ]),
      slide('#e8eaf6', [
        textEl({ text: '#1 Rest', y: 350, fontSize: 56, fontFamily: 'Raleway', fill: '#283593' }),
        textEl({ text: 'Give yourself permission to do absolutely nothing.', y: 480, fontSize: 28, fontWeight: 'normal', fontFamily: 'Raleway', fill: '#5c6bc0' }),
      ]),
      slide('#e0f7fa', [
        textEl({ text: '#2 Nature', y: 350, fontSize: 56, fontFamily: 'Raleway', fill: '#00695c' }),
        textEl({ text: 'Spend at least 30 minutes outdoors today.', y: 480, fontSize: 28, fontWeight: 'normal', fontFamily: 'Raleway', fill: '#26a69a' }),
      ]),
    ],
  },
];

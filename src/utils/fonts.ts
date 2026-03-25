export const TIER1_FONTS = [
  'Inter',
  'Playfair Display',
  'Montserrat',
  'Oswald',
  'Lora',
  'Raleway',
];

export const TIER2_FONTS = [
  'Roboto',
  'Open Sans',
  'Poppins',
  'Merriweather',
  'Bebas Neue',
  'Pacifico',
  'Dancing Script',
  'Satisfy',
  'Permanent Marker',
  'Abril Fatface',
];

export const ALL_FONTS = [...TIER1_FONTS, ...TIER2_FONTS];

function buildGoogleFontsUrl(fonts: string[]): string {
  const families = fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;700`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export async function loadFonts(fonts: string[], timeout = 5000): Promise<void> {
  return new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = buildGoogleFontsUrl(fonts);

    const timer = setTimeout(() => {
      resolve();
    }, timeout);

    link.onload = async () => {
      try {
        await Promise.all(
          fonts.map(f => document.fonts.load(`16px "${f}"`))
        );
        const allLoaded = fonts.every(f => document.fonts.check(`16px "${f}"`));
        if (!allLoaded) {
          await new Promise(r => setTimeout(r, 500));
        }
      } catch {
        // fallback to system font
      }
      clearTimeout(timer);
      resolve();
    };

    link.onerror = () => {
      clearTimeout(timer);
      resolve();
    };

    document.head.appendChild(link);
  });
}

let tier1Loaded = false;
let tier2Loaded = false;

export async function loadTier1Fonts(): Promise<void> {
  if (tier1Loaded) return;
  tier1Loaded = true;
  await loadFonts(TIER1_FONTS);
}

export async function loadTier2Fonts(): Promise<void> {
  if (tier2Loaded) return;
  tier2Loaded = true;
  await loadFonts(TIER2_FONTS);
}

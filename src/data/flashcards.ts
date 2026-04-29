import { Flashcard } from '../types';

/**
 * Dynamic Asset Loader
 * This uses Vite's glob import to find all images in the assets folder.
 * This is the best way to handle 100+ cards based on filenames.
 */

const assetImages = import.meta.glob('../assets/*.jpg', { eager: true, as: 'url' });

const getImageUrl = (category: string, number: string, side: 'fs' | 'bs'): string => {
  const filename = `../assets/${category.toLowerCase()}_${number}_${side}.jpg`;
  // Fallback to placeholder if file doesn't exist yet
  // return (assetImages[filename] as string) || `https://picsum.photos/seed/${category}${number}${side}/600/400`;
  return (assetImages[filename] as string);
};

const generateCards = (): Flashcard[] => {
  const cardsMap = new Map<string, { category: string, number: string }>();

  // Scan all actual files discovered by Vite in the assets folder
  Object.keys(assetImages).forEach(path => {
    // Expected format: ../assets/category_number_side.jpg
    // Example: ../assets/fanali_001_fs.jpg
    const match = path.match(/\/assets\/([a-z0-9]+)_(\d+)_([fb]s)\.jpg$/i);
    
    if (match) {
      const [_, category, number] = match;
      const cardKey = `${category}_${number}`;
      
      if (!cardsMap.has(cardKey)) {
        cardsMap.set(cardKey, { category, number });
      }
    }
  });

  // Convert map to Flashcard array
  const cards: Flashcard[] = Array.from(cardsMap.entries()).map(([id, info]) => {
    const front = getImageUrl(info.category, info.number, 'fs');
    const back = getImageUrl(info.category, info.number, 'bs');

    return {
      id,
      category: info.category.toUpperCase(),
      title: `${info.category.toUpperCase()} ${info.number}`,
      // Use fallback placeholder only if neither front nor back exist (shouldn't happen with this logic)
      frontImage: front || `https://picsum.photos/seed/${id}f/600/400`,
      backImage: back || `https://picsum.photos/seed/${id}b/600/400`,
    };
  });

  // Sort by ID to keep logical sequence
  return cards.sort((a, b) => a.id.localeCompare(b.id));
};

export const FLASHCARDS: Flashcard[] = generateCards();

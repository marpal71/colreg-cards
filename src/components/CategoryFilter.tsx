import { Category } from '../types';
import { FLASHCARDS } from '../data/flashcards';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  const getCount = (cat: Category) => {
    if (cat === 'All') return FLASHCARDS.length;
    return FLASHCARDS.filter(c => c.category === cat).length;
  };

  return (
    <nav className="flex-1 space-y-8 h-full overflow-y-auto custom-scrollbar pr-4">
      <section>
        <h2 className="text-[11px] uppercase tracking-widest text-gold mb-6 opacity-80">CARDS</h2>
        <ul className="space-y-4">
          <li 
            onClick={() => onSelect('All')}
            className={`flex items-center justify-between text-sm cursor-pointer transition-all group ${selectedCategory === 'All' ? 'text-gold' : 'text-stone-400 hover:text-white'}`}
          >
            <span>Tutte</span>
            <span className={`text-[10px] opacity-40 group-hover:opacity-100 ${selectedCategory === 'All' ? 'opacity-100' : ''}`}>
              {getCount('All')}
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-[11px] uppercase tracking-widest text-gold mb-6 opacity-80">Categorie</h2>
        <ul className="space-y-5">
          {categories.filter(cat => cat !== 'All').map((cat) => (
            <li 
              key={cat}
              onClick={() => onSelect(cat)}
              className={`flex items-center justify-between text-sm cursor-pointer transition-all group ${selectedCategory === cat ? 'text-white font-medium' : 'text-stone-500 hover:text-white'}`}
            >
              <span className="flex items-center">
                {selectedCategory === cat && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2 shrink-0"></span>
                )}
                {cat}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${selectedCategory === cat ? 'bg-gold text-black border-gold font-bold' : 'bg-[#1a1a1a] border-[#333] opacity-60 group-hover:opacity-100'}`}>
                {getCount(cat)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
}

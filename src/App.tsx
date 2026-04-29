import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Layers, RotateCcw } from 'lucide-react';
import { FLASHCARDS } from './data/flashcards';
import { Category } from './types';
import FlashcardItem from './components/FlashcardItem';
import CategoryFilter from './components/CategoryFilter';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridScale, setGridScale] = useState(0.5); 
  const [isFocusMode, setIsFocusMode] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(FLASHCARDS.map(c => c.category)));
    return ['All', ...cats.sort()] as Category[];
  }, []);

  const filteredCards = useMemo(() => {
    return FLASHCARDS.filter(card => {
      const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
      const matchesSearch = card.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           card.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#d4d4d4] font-sans selection:bg-gold/30" id="app-root">
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.aside 
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-80 border-r border-[#262626] bg-[#0d0d0d] flex flex-col shrink-0 z-50"
          >
            <div className="p-10 border-b border-[#262626]">
              <h1 className="text-gold font-display text-4xl tracking-tight uppercase text-glow">Colreg</h1>
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mt-1 font-mono">Collision Regulation</p>
            </div>
            
            <div className="p-8 flex-1 overflow-hidden flex flex-col">
              <section className="mb-10 px-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[11px] uppercase tracking-widest text-gold opacity-80">Grid Scale</h2>
                  <span className="text-[10px] font-mono text-stone-500">{Math.round(gridScale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.2" 
                  max="1.5" 
                  step="0.1" 
                  value={gridScale}
                  onChange={(e) => setGridScale(parseFloat(e.target.value))}
                  className="w-full accent-gold h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer border border-[#262626]"
                />
              </section>

              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelect={setSelectedCategory} 
              />
            </div>

            <div className="p-8 border-t border-[#262626] flex items-center justify-between">
               <div className="text-[10px] opacity-30 font-mono tracking-widest uppercase">
                &copy; 2024 Nexus
              </div>
              <button 
                onClick={() => setIsFocusMode(true)}
                className="text-gold hover:text-white transition-colors p-2 bg-[#111] border border-[#222] rounded flex items-center gap-2 group"
              >
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Focus</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isFocusMode && (
           <button 
             onClick={() => setIsFocusMode(false)}
             className="fixed top-8 left-8 z-[100] p-4 bg-gold text-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
           >
             <Layers className="w-5 h-5" />
           </button>
        )}

        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 texture-overlay pointer-events-none"></div>

        {/* Header */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.header 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="p-10 flex items-center justify-between border-b border-[#262626]/50 bg-[#0a0a0a]/80 backdrop-blur-md z-40"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold block mb-1 font-mono opacity-80">Current Archive</span>
                <h3 className="text-2xl font-display italic text-[#f2f2f2]">
                  {selectedCategory === 'All' ? 'TUTTE' : selectedCategory}
                </h3>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="relative group hidden md:block">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 transition-colors group-focus-within:text-gold" />
                  <input 
                    type="text"
                    placeholder="Search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 pr-4 py-1.5 bg-transparent border-b border-[#262626] focus:border-gold outline-none font-sans text-xs transition-all w-48 text-stone-400 placeholder:text-stone-700 focus:text-stone-200"
                    id="search-box"
                  />
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-1 font-mono">Archive Entry</span>
                  <span className="text-xl font-display">
                    {filteredCards.length} <span className="opacity-30 text-sm">/</span> {FLASHCARDS.length}
                  </span>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Scrollable Grid */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar relative z-10 transition-all duration-700 ${isFocusMode ? 'p-12' : 'px-24 py-16 md:px-32'}`}>
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid gap-10"
              style={{ 
                gridTemplateColumns: `repeat(auto-fill, minmax(${320 * gridScale}px, 1fr))` 
              }}
              id="card-grid"
            >
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: Math.min(index * 0.02, 0.4),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <FlashcardItem card={card} scale={gridScale} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredCards.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <RotateCcw className="w-8 h-8 text-stone-800 mb-6" />
              <h3 className="font-display italic text-2xl text-stone-600">No concepts found</h3>
              <p className="text-stone-700 text-sm mt-2 max-w-xs mx-auto">The search criteria did not match any entries in the current lexicon.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-10 text-[10px] font-mono uppercase tracking-[0.3em] text-gold border border-gold/30 px-8 py-3 hover:bg-gold hover:text-black transition-all"
              >
                Reset Archive
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}

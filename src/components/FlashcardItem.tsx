import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardItemProps {
  card: Flashcard;
  scale?: number;
}

export default function FlashcardItem({ card, scale = 1 }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);

  // Calculate the scale factor needed to bring the card back to "original" (1.0) size on hover
  // We limit it slightly so it doesn't cover too much screen at extremely small grid scales
  const targetHoverScale = Math.min(1.2 / scale, 4);

  return (
    <>
      <motion.div 
        className="group perspective-1000 w-full cursor-pointer relative"
        style={{ 
          height: `${320 * scale}px`,
          zIndex: isFlipped ? 10 : 1 
        }}
        whileHover={{ 
          scale: targetHoverScale, 
          zIndex: 50,
          y: -10 
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        id={`card-${card.id}`}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          onDoubleClick={(e) => {
            if (isFlipped) {
              e.stopPropagation();
              setIsModalOpen(true);
              setModalZoom(1);
            }
          }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-[#0d0d0d] rounded-sm overflow-hidden">
            <img 
              src={card.frontImage} 
              alt=""
              className="w-full h-full object-cover opacity-100 transition-opacity duration-500"
            />
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0d0d0d] rounded-sm overflow-hidden">
            <img 
              src={card.backImage} 
              alt=""
              className="w-full h-full object-cover opacity-100 transition-opacity duration-500"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 md:p-12"
          >
            {/* Modal Controls */}
            <div className="absolute top-8 right-8 flex items-center gap-4 z-[110]">
              <div className="flex items-center gap-2 bg-[#111] border border-[#222] p-1 rounded-full shadow-2xl">
                <button 
                  onClick={() => setModalZoom(prev => Math.max(0.5, prev - 0.2))}
                  className="p-3 hover:text-gold transition-colors text-stone-500"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-mono w-12 text-center text-stone-400">
                  {Math.round(modalZoom * 100)}%
                </span>
                <button 
                  onClick={() => setModalZoom(prev => Math.min(3, prev + 0.2))}
                  className="p-3 hover:text-gold transition-colors text-stone-500"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-[#111] border border-[#222] rounded-full text-stone-400 hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Container */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <motion.div
                drag
                dragMomentum={false}
                animate={{ scale: modalZoom }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <img 
                  src={card.backImage} 
                  alt={card.title}
                  className="w-full h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-[#222] select-none pointer-events-none"
                  style={{ minWidth: '300px' }}
                />
                
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-gold/10 pointer-events-none"></div>
                <div className="absolute -inset-8 border border-gold/5 pointer-events-none"></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

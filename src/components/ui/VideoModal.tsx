import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // PlayCircle ve HardDrive artık kullanılmadığı için kaldırıldı
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
};

export default function VideoModal({ isOpen, onClose, videoUrl }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex justify-center items-center max-w-5xl max-h-[85vh] bg-black border border-cyan-500/30 shadow-[0_0_80px_rgba(0,255,255,0.25)] rounded-xl overflow-hidden group"
          >
            {/* KAPATMA BUTONU */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 bg-black/60 border border-cyan-500/50 text-cyan-400 rounded-full backdrop-blur-md hover:bg-cyan-500 hover:text-white transition-all scale-100 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            >
              <X size={20} />
            </button>

            {/* VİDEO OYNATICI */}
            <video
              src={videoUrl}
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl"
              autoPlay
              controls
              playsInline
            />

            {/* Siber Köşe Detayları: Metinler kalksa da bu ince dekorlar korunuyor (z-0) */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 -skew-x-12 -translate-y-12 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 -skew-x-12 translate-y-12 pointer-events-none z-0" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
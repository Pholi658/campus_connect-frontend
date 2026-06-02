import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-brand-primary/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] h-[60%] w-[60%] rounded-full bg-green-500/20 blur-[120px]"
        />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center" 
        style={{ perspective: 1000 }}
        exit={{ 
          scale: 4,
          opacity: 0,
          filter: "blur(20px)",
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        {/* 3D Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotateY: 0,
            y: [-10, 10, -10]
          }}
          transition={{ 
            scale: { duration: 0.8, ease: "easeOut" },
            opacity: { duration: 0.8 },
            rotateY: { duration: 1.2, ease: "easeOut" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative mb-12 flex h-32 w-32 items-center justify-center"
        >
          {/* Logo Glow Ring */}
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-[2.5rem] bg-brand-primary/30 blur-2xl"
          />
          
          <div className="relative flex h-full w-full items-center justify-center rounded-[2.5rem] bg-linear-to-br from-brand-primary to-green-600 shadow-[0_0_50px_rgba(34,197,94,0.3)] ring-1 ring-white/20">
            <Logo className="h-16 w-16" />
          </div>
          
          {/* Orbiting Elements */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] rounded-full border border-white/5"
              style={{ rotateZ: i * 45 }}
            >
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-primary shadow-[0_0_10px_#22c55e]"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Text Animation */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <h1 className="bg-linear-to-r from-white to-white/60 bg-clip-text text-3xl font-black tracking-tighter text-transparent">
              Campus<span className="text-brand-primary">Connect</span>
            </h1>
            <div className="mt-2 h-1 w-12 overflow-hidden rounded-full bg-white/10">
              <motion.div 
                animate={{ x: [-48, 48] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full bg-brand-primary"
              />
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-white"
          >
            Lesotho Marketplace
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;

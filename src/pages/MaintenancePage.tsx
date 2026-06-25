import { motion } from "framer-motion";

export const MaintenancePage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-foreground flex items-center justify-center px-6">
      {/* Glow orbs */}
      <div aria-hidden className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-cyan-500/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-3xl" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-sm tracking-[0.4em] uppercase text-cyan-300/80"
        >
          Coming Soon
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-4 text-3xl md:text-5xl font-semibold text-white"
        >
          We're crafting something{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            extraordinary
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-5 text-base md:text-lg text-slate-300/90 max-w-xl mx-auto leading-relaxed"
        >
          We're currently redesigning and improving our platform. Our website will be back soon.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 mx-auto h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10"
        >
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.6)]"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          System Upgrade in Progress
        </motion.div>

        <p className="mt-12 text-xs text-slate-500">
          © {new Date().getFullYear()} JewelIQ · Smart Digital Solutions
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
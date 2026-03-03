export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

export const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } },
};

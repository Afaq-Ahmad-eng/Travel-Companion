import React from 'react';
import { motion } from 'framer-motion'; // ✅ Import motion
import Hero from '../components/HeroSection/Hero';
import heroImage from '../Assets/15.jpg';
import Footer from '../components/FooterPage/Footer';
import RMVPINKPK from '../components/RecentlyVisitorStats/RMVPINKPK';

// ✅ Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

export default function Services() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Hero 
        cName="hero service-hero"
        heroImage={heroImage}
        text=""
        buttontext=""
        url=""
        btnclass="hide"
      />
      <RMVPINKPK/>

      <Footer />
    </motion.div>
  );
}

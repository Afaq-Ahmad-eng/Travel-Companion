import React from 'react';
import { motion } from 'framer-motion'; // ✅ Import motion
import Hero from '../components/HeroSection/Hero';
import heroImage from '../Assets/16.jpg';
import Aboutus from '../components/AboutUsPage/Aboutus';
import Footer from '../components/FooterPage/Footer';

// ✅ Modern animation variant
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
      ease: [0.25, 0.46, 0.45, 0.94], // Modern cubic-bezier curve
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

export default function About() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Hero 
        cName="hero-mid"
        heroImage={heroImage}
        title="About Us"
        /* text and btn is hidden only in about section by css line 32 */ 
        text="Choose your favrite destination"
        buttontext="Travel Plan"
        url="/"
        btnclass="show"
      />

      <Aboutus />
      <Footer />
    </motion.div>
  );
}

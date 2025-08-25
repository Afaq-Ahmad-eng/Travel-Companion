import React from 'react';
import { motion } from 'framer-motion'; // ✅ Import motion
import Hero from '../components/HeroSection/Hero';
import heroImage from '../Assets/13.jpg';
import Footer from '../components/FooterPage/Footer';
import Contactform from '../components/ContactUsPage/Contactform';

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

export default function Contact() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Hero 
        cName="hero contact-hero"
        heroImage={heroImage}
        title="Contact us"
        text="We’d love to hear from you!"
      />
      <Contactform />
      <Footer />
    </motion.div>
  );
}

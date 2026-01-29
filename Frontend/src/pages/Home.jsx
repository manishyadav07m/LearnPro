import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import About from './About';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
// components/HomePage.jsx

import React from 'react';
import Header from './Header';
import Banner from './Banner';
import MainContent from './MainContent';
import Footer from './Footer';


const Home = () => {
    // Function to scroll to the "Start Application" button
    const scrollToApplication = () => {
      const startApplicationButton = document.getElementById('startApplication');
      if (startApplicationButton) {
        startApplicationButton.scrollIntoView({ behavior: 'smooth' });
      }
    };
  return (
    <div>
      <Header scrollToApplication={scrollToApplication} />
      <Banner scrollToApplication={scrollToApplication} />
      <MainContent />
      <Footer />
    </div>
  );
};

export default Home;

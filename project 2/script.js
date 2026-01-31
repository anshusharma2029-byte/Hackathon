// src/App.js

import React, { useEffect, useRef, useState } from 'react';
import './App.css'; 
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Contact from './components/Contact';

// --- Data Models ---
const featureData = [
  { icon: '📋', title: 'Share Notes & Study Resources', description: 'Access and share study materials effortlessly', bg: '#6b9bd1' },
  { icon: '🔄', title: 'Borrow / Rent / Lend System', description: 'Easily borrow and lend everyday items on campus', bg: '#c9a88f' },
  { icon: '🚗', title: 'Ride Sharing / Cab Sharing', description: 'Share cabs and find students going your way', bg: '#98aca0' },
  { icon: '🔍', title: 'Lost & Found Hub', description: 'Help students recover lost items on campus', bg: '#b5a085' },
];

const contactData = [
  { icon: '📧', title: 'Email Us', detail: 'hello@studenthood.com', sub: 'We\'ll respond within 24 hours', isLink: true },
  { icon: '💬', title: 'Support', detail: 'support@studenthood.com', sub: 'For technical issues and help', isLink: true },
  { icon: '🤝', title: 'Partnerships', detail: 'partner@studenthood.com', sub: 'Collaborate with us on campus', isLink: true },
  { icon: '📍', title: 'Location', detail: 'Campus Innovation Hub', sub: 'Building Community, One Campus at a Time', isLink: false },
];

const visionData = [
    { title: 'Peer-to-peer Help', description: 'Students supporting students in meaningful ways' },
    { title: 'Sustainable Sharing', description: 'Reduce waste by sharing resources efficiently' },
    { title: 'Real Community', description: 'Build authentic connections and interactions' },
    { title: 'Trusted Network', description: 'A safer campus environment for everyone' },
];

// --- Custom Hook 1: Scroll Animations (useFadeInOnScroll) ---
const useFadeInOnScroll = (rootMargin = '0px 0px -100px 0px') => {
  const elementsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || '0s'; 
          entry.target.style.transitionDelay = delay; 
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin,
    });

    let staggerIndex = 0; 
    
    elementsRef.current.forEach(el => {
      if (el) {
        el.classList.add('fade-in-on-scroll');
        
        if (el.classList.contains('feature-card') || el.classList.contains('vision-item') || el.classList.contains('contact-item') || el.closest('nav')) {
             el.setAttribute('data-delay', `${staggerIndex * 0.15}s`);
             staggerIndex++;
        } else {
             el.setAttribute('data-delay', '0s');
        }

        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [rootMargin]);

  const registerRef = (el) => {
    if (el && el.classList && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };
  return registerRef;
};

// --- Custom Hook 2: Active Section Tracking (useActiveSection) ---
const useActiveSection = (sectionIds, rootMargin = '-40% 0px -60% 0px') => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin, // Centered margin ensures the section closest to the middle of the viewport is 'active'
        threshold: 0.01,
      }
    );

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeSection;
};


// --- Main App Component ---
const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const registerFadeIn = useFadeInOnScroll();
  
  const sectionIds = ['home', 'features', 'about', 'contact'];
  const activeSection = useActiveSection(sectionIds); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header 
        isScrolled={isScrolled} 
        registerFadeIn={registerFadeIn} 
        activeSection={activeSection}
      /> 
      <Hero registerFadeIn={registerFadeIn} />
      <Features features={featureData} registerFadeIn={registerFadeIn} />
      <About registerFadeIn={registerFadeIn} visionData={visionData} />
      <Contact contactData={contactData} registerFadeIn={registerFadeIn} />
    </>
  );
};

export default App;
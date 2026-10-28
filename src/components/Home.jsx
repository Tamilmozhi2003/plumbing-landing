import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Asset imports
import heroPlumber from '../assets/images/hero-plumber.png';
import heroPipesOval from '../assets/images/hero-pipes-oval.jpg';
import heroSinkCapsule from '../assets/images/hero-sink-capsule.jpg';
import emergencyIcon from '../assets/images/emergency-icon.png';
import aboutConsult from '../assets/images/about-consult.jpg';
import aboutSink from '../assets/images/about-sink.jpg';
import aboutIcon from '../assets/images/about-icon.png';
import aboutPipe from '../assets/images/about-pipe.png';
import serviceDrain from '../assets/images/service-drain.jpg';
import serviceHeater from '../assets/images/service-heater.jpg';
import serviceLeak from '../assets/images/service-leak.jpg';
import serviceGas from '../assets/images/service-gas.jpg';
import whyUsPlumber from '../assets/images/why-us-plumber.jpg';
import wrenchHandVector from '../assets/images/about-vector2.png';
import tapFaucetVector from '../assets/images/about-vector.png';
import project1 from '../assets/images/project-1.jpg';
import project2 from '../assets/images/project-2.jpg';
import project3 from '../assets/images/project-3.jpg';
import avatar1 from '../assets/images/avatar-1.jpg';
import avatar2 from '../assets/images/avatar-2.jpg';
import avatar3 from '../assets/images/avatar-3.jpg';
import solutionsPlumber from '../assets/images/solutions-plumber.jpg';
import solutionsPipe from '../assets/images/solutions-pipe.jpg';
import areaThumb1 from '../assets/images/area-thumb-1.jpg';
import areaThumb2 from '../assets/images/area-thumb-2.jpg';
import areaThumb3 from '../assets/images/area-thumb-3.jpg';
import areaThumb4 from '../assets/images/area-thumb-4.jpg';

export default function Home() {
  // State for active service card
  const [activeService, setActiveService] = useState(1);

  // State for active process step
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  // State for ZIP Checker
  const [zipCode, setZipCode] = useState('');
  const [zipResult, setZipResult] = useState(null);

  // Active navigation link & Lenis reference
  const [activeNav, setActiveNav] = useState('home');
  const lenisRef = useRef(null);

  // Section references
  const projectsSectionRef = useRef(null);
  const areaSectionRef = useRef(null);

  // Smooth scroll handler using Lenis without breaking React Router
  const scrollToSection = (e, targetId, navKey) => {
    if (e) e.preventDefault();
    if (navKey) setActiveNav(navKey);

    const element = document.querySelector(targetId);
    if (element) {
      if (lenisRef.current) {
        // -70px offset for the sticky navbar height
        lenisRef.current.scrollTo(element, { offset: -70, duration: 1.2 });
      } else {
        const yOffset = -70;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 80,
    });
    AOS.refresh();
  }, []);

  // Initialize Lenis Smooth Scroll & GSAP ScrollTrigger
  useEffect(() => {
    // 1. Setup Lenis smooth scrolling across the landing page
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // 2. Synchronize Lenis scroll position with GSAP ScrollTrigger & Active Nav indicator
    const sections = ['home', 'about', 'services', 'why-us', 'projects', 'booking'];

    lenis.on('scroll', () => {
      ScrollTrigger.update();

      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(sections[i]);
          break;
        }
      }
    });

    // 3. Connect GSAP ticker to Lenis requestAnimationFrame loop
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 4. GSAP ScrollTrigger Animations (active on desktop / tablet > 1024px)
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1025px)', () => {
      // 4.1 OUR PROJECTS: Left and Right cards start tucked behind the center card,
      // and smoothly slide out and fix in their places on scroll
      gsap.fromTo(
        '.project-card-left',
        { xPercent: 100, x: 32, scale: 0.96, opacity: 0.15 },
        {
          xPercent: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top 75%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      gsap.fromTo(
        '.project-card-right',
        { xPercent: -100, x: -32, scale: 0.96, opacity: 0.15 },
        {
          xPercent: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top 75%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      // 4.2 SERVICE AREA: 4 corner edge images start outer,
      // and smoothly glide inward to fix in place inside the card
      const cornerConfigs = [
        { sel: '.corner-top-left', fromX: -120, fromY: -90 },
        { sel: '.corner-bottom-left', fromX: -120, fromY: 90 },
        { sel: '.corner-top-right', fromX: 120, fromY: -90 },
        { sel: '.corner-bottom-right', fromX: 120, fromY: 90 },
      ];

      cornerConfigs.forEach(({ sel, fromX, fromY }) => {
        gsap.fromTo(
          sel,
          { x: fromX, y: fromY, scale: 0.8, opacity: 0 },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#booking',
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    });

    // Refresh ScrollTrigger and AOS after setup
    ScrollTrigger.refresh();
    AOS.refresh();

    return () => {
      mm.revert();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);


  // ZIP verification
  const handleZipCheck = (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return;
    setZipResult({
      status: 'success',
      message: `Great news! Technicians are available now for same-day dispatch in ${zipCode.trim()}.`
    });
  };

  const services = [
    {
      id: 0,
      title: 'Drain Cleaning',
      desc: 'Fast, odorless clog removal',
      image: serviceDrain,
      icon: 'bi-droplet-half'
    },
    {
      id: 1,
      title: 'Water Heater Repair',
      desc: 'Hot water restored, same day.',
      image: serviceHeater,
      icon: 'bi-fire'
    },
    {
      id: 2,
      title: 'Pipe Leak Repair',
      desc: 'Stop damage before it spreads',
      image: serviceLeak,
      icon: 'bi-tools'
    },
    {
      id: 3,
      title: 'Gas Line Services',
      desc: 'Certified techs. Safety first.',
      image: serviceGas,
      icon: 'bi-shield-check'
    }
  ];

  const processSteps = [
    {
      step: '01',
      badge: 'Step 01',
      duration: '< 60 Sec',
      title: 'Online Booking',
      subtitle: 'Effortless 24/7 Scheduling',
      desc: 'Pick your preferred date and convenient arrival window in seconds, or connect instantly with our emergency dispatchers.',
      icon: 'bi-calendar-check-fill'
    },
    {
      step: '02',
      badge: 'Step 02',
      duration: 'Zero Obligation',
      title: 'On-Site Diagnostic',
      subtitle: 'Thorough Inspection & Upfront Quote',
      desc: 'Our licensed master technician arrives with advanced fiber-optic cameras to pinpoint the root cause with transparent pricing.',
      icon: 'bi-search'
    },
    {
      step: '03',
      badge: 'Step 03',
      duration: 'Same-Day Fix',
      title: 'Precision Repair',
      subtitle: 'Master Craftsmanship & OEM Parts',
      desc: 'We resolve the problem on the spot using commercial-grade copper, PEX, and manufacturer-certified components.',
      icon: 'bi-tools'
    },
    {
      step: '04',
      badge: 'Step 04',
      duration: '1-Yr Warranty',
      title: 'Quality Guarantee',
      subtitle: 'Multi-Point Testing & Sign-off',
      desc: 'We conduct full hydrostatic pressure checks, leave the area spotless, and back our workmanship with an unconditional warranty.',
      icon: 'bi-shield-fill-check'
    }
  ];


  return (
    <div className="home-container">
      {/* MAIN NAVBAR */}
      <header className="main-header">
        <div className="container header-content">
          <div className="logo-brand">
            <div className="logo-icon-wrap">
              <i className="bi bi-droplet-fill"></i>
            </div>
            <div className="logo-text">
              <span className="brand-name">VALVORD</span>
             
            </div>
          </div>

          <nav className="main-nav">
            <a 
              href="#home" 
              className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, '#home', 'home')}
            >
              Home
            </a>
            <a 
              href="#about" 
              className={`nav-item ${activeNav === 'about' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, '#about', 'about')}
            >
              About
            </a>
            <a 
              href="#services" 
              className={`nav-item ${activeNav === 'services' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, '#services', 'services')}
            >
              Services
            </a>
            <a 
              href="#why-us" 
              className={`nav-item ${activeNav === 'why-us' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, '#why-us', 'why-us')}
            >
              Why Us
            </a>
            <a 
              href="#projects" 
              className={`nav-item ${activeNav === 'projects' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, '#projects', 'projects')}
            >
              Projects
            </a>
          </nav>

          <div className="header-actions">
            <a href="tel:+18002894331" className="header-call-pill">
              <span className="call-icon"><i className="bi bi-headset"></i></span>
            </a>
            <a 
              href="#booking" 
              className="btn-primary-glow"
              onClick={(e) => scrollToSection(e, '#booking', 'booking')}
            >
              Book Online <i className="bi bi-calendar-check"></i>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-card">
            {/* Background Watermark Illustration */}
            <div className="hero-pipe-watermark">
              <i className="bi bi-water"></i>
            </div>

            {/* Left Content Column */}
            <div className="hero-left-col">
              {/* Headline */}
              <h1 className="hero-main-title">
                EXPERT <br />
                PLUMBING.
              </h1>

              {/* Middle Row: Capsule Photo + Tagline + Cyan CTA */}
              <div className="hero-action-row">
                {/* Capsule Plumber Sink Photo */}
                <div className="capsule-frame">
                  <img src={heroSinkCapsule} alt="Plumbers repairing sink" />
                </div>

                <div className="hero-cta-block">
                  <p className="hero-tagline">
                    <span className="dash-symbol"></span> Fast, licensed, and local. From leaks to clogs to heater failures—our experts fix it today.
                  </p>

                  <div className="hero-btn-container">
                    <a 
                      href="#booking" 
                      className="btn-cyan-pill"
                      onClick={(e) => scrollToSection(e, '#booking', 'booking')}
                    >
                      <span>Book Appointment</span>
                      <span className="btn-arrow-badge">
                        <i className="bi bi-arrow-right-short"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics & Scroll Indicator */}
              <div className="hero-footer-stats">
                <div className="metric-box">
                  <h3 className="metric-num">15K+</h3>
                  <p className="metric-label">Satisfied Clients</p>
                </div>

                <div className="metric-box">
                  <h3 className="metric-num">250+</h3>
                  <p className="metric-label">Projects Completed</p>
                </div>

              </div>
            </div>

            {/* Right Visual Column */}
            <div className="hero-right-col">
              {/* Blue/Cyan-bordered Oval showing chrome pipes */}
              <div className="oval-pipe-window">
                <img src={heroPipesOval} alt="Pipes inspection" className="oval-pipes-img" />
              </div>


              {/* Plumber Holding Wrench Overlapping Front */}
              <div className="plumber-front-wrapper">
                <img src={heroPlumber} alt="Expert Plumber" className="plumber-front-img" />
              </div>

              {/* Dark Navy Floating Emergency Card */}
              <div className="floating-emergency-card">
                <div className="emergency-siren-icon">
                  <img src={emergencyIcon} alt="Emergency Siren" className="emergency-siren-img" />
                </div>
                <h4 className="emergency-title">Emergency</h4>
                <p className="emergency-time">
                  Typical arrival<br />
                  <span>30-60 min</span>
                </p>
                <div className="emergency-caret">
                  <i className="bi bi-chevron-compact-down"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION (Pixel-Accurate to Template Image 2) */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-card-container">
            {/* Left Visuals (2 Plumber Photos + Capsule Badge) */}
            <div className="about-visuals-col">
              {/* Image 1: Plumber with Clipboard & Customer */}
              <div
                className="about-photo-card consult-card"
                data-aos="fade-right"
                data-aos-duration="850"
                data-aos-easing="ease-out-cubic"
              >
                <img src={aboutConsult} alt="Plumber with customer and clipboard" />
              </div>

              {/* Image 2: Plumber Under Sink Cabinet */}
              <div
                className="about-photo-card sink-card"
                data-aos="fade-right"
                data-aos-delay="200"
                data-aos-duration="950"
                data-aos-easing="ease-out-cubic"
              >
                <img src={aboutSink} alt="Plumber working under kitchen sink" />

                {/* Vertical Oval Experience Badge */}
                <div className="capsule-experience-badge">
                  <div className="exp-navy-circle">
                    <img src={aboutIcon} alt="Experience" className="exp-icon-img" />
                  </div>
                  <strong className="exp-years-num">15+</strong>
                  <span className="exp-years-label">Years of<br />Experience</span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div
              className="about-text-col"
              data-aos="fade-left"
              data-aos-duration="900"
              data-aos-delay="150"
              data-aos-easing="ease-out-cubic"
            >
              <span className="about-cyan-tag">About Us</span>
              <h2 className="about-title">
                Delivering Quality <br />
                Plumbing Solutions
              </h2>
              <p className="about-lead-text">
                We are dedicated to delivering high-quality plumbing services built on expertise, reliability, and attention to detail. From routine maintenance to complex repairs our skilled plumbers use modern tools to ensure lasting results.
              </p>

              <div className="about-checks-grid">
                <div className="about-check-item">
                  <span className="cyan-check-icon"><i className="bi bi-check-lg"></i></span>
                  <span>Licensed & Insured</span>
                </div>
                <div className="about-check-item">
                  <span className="cyan-check-icon"><i className="bi bi-check-lg"></i></span>
                  <span>Same-day service</span>
                </div>
                <div className="about-check-item">
                  <span className="cyan-check-icon"><i className="bi bi-check-lg"></i></span>
                  <span>Upfront, fair pricing</span>
                </div>
                <div className="about-check-item">
                  <span className="cyan-check-icon"><i className="bi bi-check-lg"></i></span>
                  <span>Plumbing Experts</span>
                </div>
              </div>

              <div className="about-btn-wrap">
                <a href="#services" className="btn-cyan-about">
                  <span>Read More</span>
                  <span className="btn-about-arrow">
                    <i className="bi bi-arrow-right-short"></i>
                  </span>
                </a>
              </div>
            </div>

            {/* Right Side Plumbing Pipe Decoration */}
            <div className="about-pipe-svg-deco">
              <img src={aboutPipe} alt="Plumbing pipe decoration" className="about-pipe-img" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section id="services" className="services-section">
        {/* Decorative Vector: Hand holding wrench (Left) */}
        <div className="services-vector-left" data-aos="fade-right" data-aos-duration="1000">
          <img src={wrenchHandVector} alt="Plumber wrench vector" />
        </div>

        {/* Decorative Vector: Water Tap (Right) */}
        <div className="services-vector-right" data-aos="fade-left" data-aos-duration="1000">
          <img src={tapFaucetVector} alt="Water faucet vector" />
        </div>

        <div className="container services-container">
          <div className="section-header text-center" data-aos="fade-up" data-aos-duration="700">
            <span className="section-tag">Our Services</span>
            <h2 className="section-title">
              Provides Professional Plumbing <br />
              Services for Every Need
            </h2>
          </div>

          <div className="services-grid">
            {services.map((item, index) => {
              const isActive = activeService === item.id;
              return (
                <div
                  key={item.id}
                  className={`service-card ${isActive ? 'active-service' : ''}`}
                  onClick={() => setActiveService(item.id)}
                  data-aos="flip-right"
                  data-aos-delay={(index * 150).toString()}
                  data-aos-duration="850"
                  data-aos-easing="ease-out-cubic"
                >
                  <div className="service-img-wrap">
                    <img src={item.image} alt={item.title} />
                    <div className="service-icon-badge">
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                  </div>
                  <div className="service-info">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="carousel-dots">
            {services.map((item) => (
              <span
                key={item.id}
                className={`dot ${activeService === item.id ? 'active' : ''}`}
                onClick={() => setActiveService(item.id)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section id="why-us" className="why-choose-section">
        <div className="container">
          <div className="why-choose-card">
            {/* Left Content Area: Header + 4 Feature Cards */}
            <div
              className="why-card-left"
              data-aos="fade-right"
              data-aos-duration="850"
              data-aos-easing="ease-out-cubic"
            >
              {/* Header: Title Left + Intro with Cyan Divider Right */}
              <div className="why-header-row">
                <div className="why-title-col">
                  <span className="why-tag">Why Choose Us</span>
                  <h2 className="why-main-title">
                    Committed to Your <br />
                    Comfort &amp; Safety.
                  </h2>
                </div>

                <div className="why-desc-col">
                  <div className="why-cyan-bar"></div>
                  <p className="why-desc-text">
                    We prioritize your comfort and safety by delivering dependable plumbing services you can trust our professionals follow quality standards.
                  </p>
                </div>
              </div>

              {/* 4 Feature Cards Row */}
              <div className="why-features-row">
                <div className="why-feature-card">
                  <div className="feature-card-icon">
                    <i className="bi bi-patch-check"></i>
                  </div>
                  <h4 className="feature-card-title">Licensed &amp; Insured</h4>
                  <p className="feature-card-desc">Every technician is certified and background-checked.</p>
                </div>

                <div className="why-feature-card">
                  <div className="feature-card-icon">
                    <i className="bi bi-clock"></i>
                  </div>
                  <h4 className="feature-card-title">Same-Day Service</h4>
                  <p className="feature-card-desc">We show up when it matters to get the job done fast.</p>
                </div>

                <div className="why-feature-card">
                  <div className="feature-card-icon">
                    <i className="bi bi-tag"></i>
                  </div>
                  <h4 className="feature-card-title">Fixed/Upfront Pricing</h4>
                  <p className="feature-card-desc">No hidden fees, no surprises. You approve the price.</p>
                </div>

                <div className="why-feature-card">
                  <div className="feature-card-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h4 className="feature-card-title">5,000+ Repairs</h4>
                  <p className="feature-card-desc">Trusted across Austin, Round Rock, Cedar Park, and more.</p>
                </div>
              </div>

              {/* Bottom Trust & Highlight Banner filling empty space */}
              <div className="why-bottom-banner">
                <div className="why-banner-badge">
                  <span className="badge-tag"><i className="bi bi-shield-fill-check"></i> PROMISE</span>
                  <strong>100% Satisfaction Guarantee</strong>
                  <p>All plumbing repairs backed by our 1-year parts & craftsmanship warranty.</p>
                </div>

                <div className="why-banner-divider"></div>

                <div className="why-banner-badge">
                  <span className="badge-tag warning"><i className="bi bi-lightning-charge-fill"></i> FAST RESPONSE</span>
                  <strong>30–45 Min Rapid Dispatch</strong>
                  <p>Mobile vans stationed across all service zones for instant dispatch.</p>
                </div>

                <div className="why-banner-divider"></div>

                <div className="why-banner-cta">
                  <div className="why-cta-info">
                    <span className="cta-subtitle">24/7 Priority Line</span>
                    <a href="tel:+18002894331" className="why-cta-phone">
                      <i className="bi bi-telephone-fill"></i> 99768
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Plumber Photo with Circular Badge */}
            <div
              className="why-card-right"
              data-aos="fade-left"
              data-aos-duration="900"
              data-aos-easing="ease-out-cubic"
            >
              <div className="why-plumber-frame">
                <img src={whyUsPlumber} alt="Plumber repairing sink" className="why-plumber-photo" />
                <div className="why-photo-badge">
                  <div className="badge-pipe-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#00b4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 2v7m0 6v7M2 12h7m6 0h7"></path>
                      <circle cx="12" cy="12" r="8"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUALITY STANDARDS & CRAFTSMANSHIP SHOWCASE */}
      <section className="solutions-section">
        <div className="container solutions-container">
          {/* Left Column: Stable Showcase Photos (Enlarged, No Swap, No Dots) */}
          <div className="solutions-visuals-col">
            <div className="solutions-cards-wrapper">
              {/* Back Image (Left): Under-Sink Chrome Pipe Repair */}
              <div
                className="showcase-card card-back"
                data-aos="fade-right"
                data-aos-duration="850"
                data-aos-easing="ease-out-cubic"
              >
                <img src={solutionsPipe} alt="Under-sink precision pipe repair" />
              </div>

              {/* Front Image (Right): Certified Plumber with Wrench */}
              <div
                className="showcase-card card-front"
                data-aos="fade-right"
                data-aos-delay="200"
                data-aos-duration="950"
                data-aos-easing="ease-out-cubic"
              >
                <img src={solutionsPlumber} alt="Certified master plumber" />
              </div>
            </div>
          </div>

          {/* Right Column: Standards, Guarantees & Craftsmanship */}
          <div
            className="solutions-content-col"
            data-aos="fade-left"
            data-aos-duration="900"
            data-aos-delay="150"
            data-aos-easing="ease-out-cubic"
          >
            <h2 className="solutions-title">
              Our Standard Of <span className="highlight-sky">Excellence</span> <br />
              <span className="highlight-sky">&amp; Guarantees</span>
            </h2>
            <p className="solutions-intro">
              We take pride in delivering dependable plumbing care backed by master craftsmanship, transparent pricing, and complete peace of mind.
            </p>

            <div className="solutions-features-list">
              <div className="solution-item">
                <div className="solution-icon-wrap">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6h20a2 2 0 0 1 2 2v28l-6-3.5-6 3.5-6-3.5-6 3.5V8a2 2 0 0 1 2-2z" />
                    <line x1="17" y1="14" x2="27" y2="14" />
                    <line x1="17" y1="20" x2="27" y2="20" />
                    <line x1="17" y1="26" x2="23" y2="26" />
                  </svg>
                </div>
                <div className="solution-text">
                  <h3>Upfront Fixed Pricing</h3>
                  <p>Transparent, itemized quotes before any work begins. No hidden charges or unexpected hourly overages.</p>
                </div>
              </div>

              <div className="solution-item">
                <div className="solution-icon-wrap">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4l14 5.5v11c0 9-6 15.5-14 18.5-8-3-14-9.5-14-18.5v-11L22 4z" />
                    <path d="M15 21.5l5 5 9.5-9.5" />
                  </svg>
                </div>
                <div className="solution-text">
                  <h3>100% Workmanship Warranty</h3>
                  <p>Every installation and repair is backed by certified parts, rigorous leak-testing, and a full warranty.</p>
                </div>
              </div>
            </div>

            {/* Quick Trust Highlights */}
            
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS / PROCESS */}
      <section id="process" className="process-section">
        {/* Ambient background glow orbs */}
        <div className="process-ambient-orb orb-left" aria-hidden="true"></div>
        <div className="process-ambient-orb orb-right" aria-hidden="true"></div>

        <div className="container process-container">
          {/* Enhanced Section Header */}
          <div className="process-header text-center">
            <div className="process-badge-pill">
              <span className="pulse-aqua-dot"></span>
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="process-main-title">
              How Our Simple &amp; Reliable <br />
              <span className="process-title-gradient">Plumbing Process Works</span>
            </h2>
            <p className="process-main-desc">
              From instant scheduling to certified sign-off, experience a transparent 4-stage pipeline engineered for speed, clean craftsmanship, and lasting peace of mind.
            </p>
          </div>

          {/* Connected Flow Pipeline Tracker (Desktop) */}
          <div className="process-flow-track" aria-hidden="true">
            <div className="track-line-bg">
              <div 
                className="track-line-fill" 
                style={{ width: `${(activeProcessStep / (processSteps.length - 1)) * 100}%` }}
              ></div>
            </div>
            <div className="track-checkpoints">
              {processSteps.map((step, idx) => (
                <button
                  key={step.step}
                  type="button"
                  className={`track-node-btn ${idx <= activeProcessStep ? 'node-reached' : ''} ${idx === activeProcessStep ? 'node-current' : ''}`}
                  onClick={() => setActiveProcessStep(idx)}
                  aria-label={`Go to ${step.title}`}
                >
                  <span className="node-number">{step.step}</span>
                  <span className="node-caption">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modern 4 Cards Grid */}
          <div className="process-cards-grid">
            {processSteps.map((step, idx) => {
              const isActive = activeProcessStep === idx;
              return (
                <div
                  key={step.step}
                  className={`process-step-card ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveProcessStep(idx)}
                  onClick={() => setActiveProcessStep(idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${step.title} - ${step.subtitle}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveProcessStep(idx); }}
                  data-aos="flip-left"
                  data-aos-delay={(idx * 150).toString()}
                  data-aos-duration="850"
                  data-aos-easing="ease-out-cubic"
                >
                  

                  {/* Card Top Meta */}
                  <div className="step-card-header">
                    <span className="step-num-pill">{step.badge}</span>
                    <span className="step-time-tag">
                      <i className="bi bi-lightning-charge-fill"></i> {step.duration}
                    </span>
                  </div>

                  {/* Icon Container with glowing aura */}
                  <div className="step-icon-outer">
                    <div className="step-icon-inner">
                      <i className={`bi ${step.icon}`}></i>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <div className="step-subtitle">{step.subtitle}</div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. OUR PROJECTS (Peaked Roof Cards) */}
      <section id="projects" className="projects-section" ref={projectsSectionRef}>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="projects-section-title">
              OUR <span className="highlight-projects">PROJECTS</span>
            </h2>
            <p className="projects-header-desc">
              Explore our recent residential and commercial plumbing installations, precision re-piping solutions, and complete luxury bathroom renovations.
            </p>
          </div>

          <div className="projects-peaked-grid">
            {/* Project Card 1 (Left - starts behind center, fixes to left place on scroll) */}
            <div className="project-peaked-card project-card-left">
              <div className="project-card-image">
                <img src={project1} alt="Industrial & residential pipe overhaul" />
              </div>
              <div className="project-card-overlay-body">
                <div className="peaked-roof-wrap">
                  <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="peaked-roof-svg">
                    <polygon points="0,48 200,6 400,48" fill="#ffffff" />
                    <polyline points="0,48 200,6 400,48" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
                <div className="project-card-content">
                  <h3 className="project-title">Commercial Piping Overhaul</h3>
                  <p className="project-desc">
                    Commercial-grade manifold overhaul and precision dual shutoff valve replacement.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Card 2 (Center Featured - stays in center, anchors the stack) */}
            <div className="project-peaked-card featured project-card-center">
              <div className="project-card-image">
                <img src={project3} alt="Master plumber installing luxury bathroom pipes" />
              </div>
              <div className="project-card-overlay-body">
                <div className="peaked-roof-wrap">
                  <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="peaked-roof-svg">
                    <polygon points="0,48 200,6 400,48" fill="#ffffff" />
                    <polyline points="0,48 200,6 400,48" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
                <div className="project-card-content">
                  <h3 className="project-title">Luxury Bathroom Renovation</h3>
                  <p className="project-desc">
                    Luxury bathroom fixture install, custom copper manifold lines, and complete leak-proof plumbing.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Card 3 (Right - starts behind center, fixes to right place on scroll) */}
            <div className="project-peaked-card project-card-right">
              <div className="project-card-image">
                <img src={project2} alt="Chrome bathtub fixture installation" />
              </div>
              <div className="project-card-overlay-body">
                <div className="peaked-roof-wrap">
                  <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="peaked-roof-svg">
                    <polygon points="0,48 200,6 400,48" fill="#ffffff" />
                    <polyline points="0,48 200,6 400,48" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
                <div className="project-card-content">
                  <h3 className="project-title">Vintage Fixture Restoration</h3>
                  <p className="project-desc">
                    Precision vintage chrome faucet fitting, pressure balancing, and premium supply line restore.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 11. CHECK SERVICE AVAILABILITY IN YOUR AREA */}
      <section id="booking" className="service-availability-section" ref={areaSectionRef}>
        <div className="container">
          <div className="service-availability-card">
            {/* Background decorative wavy elements */}
            <div className="area-bg-pattern" aria-hidden="true">
              <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="area-waves-svg">
                <path d="M0,100 C150,200 350,-50 500,100 C650,250 900,50 1200,150 L1200,400 L0,400 Z" fill="rgba(255,255,255,0.03)" />
                <path d="M0,250 C300,120 600,320 900,200 C1050,140 1150,220 1200,260 L1200,400 L0,400 Z" fill="rgba(255,255,255,0.02)" />
              </svg>
            </div>

            {/* 4 Floating corner image cards (start outer, slide & fix inside on scroll) */}
            <div className="corner-card corner-top-left">
              <img src={areaThumb1} alt="Plumbing fixture repair" />
              <div className="corner-bubble bubble-cyan-1"></div>
            </div>

            <div className="corner-card corner-bottom-left">
              <img src={areaThumb2} alt="Hands repairing copper pipes" />
              <div className="corner-bubble bubble-cyan-2"></div>
              <div className="corner-bubble bubble-cyan-3"></div>
            </div>

            <div className="corner-card corner-top-right">
              <img src={areaThumb3} alt="Friendly licensed technician" />
              <div className="corner-bubble bubble-cyan-4"></div>
            </div>

            <div className="corner-card corner-bottom-right">
              <img src={areaThumb4} alt="Kitchen sink pipe maintenance" />
              <div className="corner-bubble bubble-cyan-5"></div>
            </div>

            {/* Center Content */}
            <div className="service-availability-content text-center">
              {/* Mobile-only visual preview of the 4 cards */}
              <div className="area-mobile-thumbs">
                <div className="mobile-thumb">
                  <img src={areaThumb1} alt="Plumbing fixture repair" />
                </div>
                <div className="mobile-thumb">
                  <img src={areaThumb2} alt="Copper pipe repair" />
                </div>
                <div className="mobile-thumb">
                  <img src={areaThumb3} alt="Licensed technician" />
                </div>
                <div className="mobile-thumb">
                  <img src={areaThumb4} alt="Kitchen sink maintenance" />
                </div>
              </div>

              <span className="area-badge-kicker">SERVICE AREA</span>
              <h2 className="area-main-title">Check Service Availability in Your Area</h2>
              <p className="area-subtitle">Enter your PIN code to check our service reach</p>

              <form onSubmit={handleZipCheck} className="area-search-form">
                <input
                  type="text"
                  placeholder="Enter Zip code, state..."
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="area-search-input"
                  aria-label="Enter Zip code or state"
                />
                <button type="submit" className="area-search-btn">
                  <span>Search</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </form>

              {zipResult ? (
                <div className="area-feedback-badge">
                  <i className="bi bi-check-circle-fill"></i> {zipResult.message}
                </div>
              ) : (
                <p className="area-footer-note">
                  Fast response &amp; 24/7 verified technician support in your neighborhood
                </p>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* 14. FOOTER */}
      <footer className="main-footer">
        <div className="container footer-content">
          <div className="footer-col brand-col">
            <div className="logo-brand">
              <div className="logo-icon-wrap">
                <i className="bi bi-droplet-fill"></i>
              </div>
              <div className="logo-text">
                <span className="brand-name light">VALVORD</span>
                <span className="brand-sub light">PLUMBING SERVICES</span>
              </div>
            </div>
            <p className="footer-desc">
              Your dependable neighborhood plumbing contractors. Fully licensed, bonded, and insured for total residential and commercial security.
            </p>
            <div className="social-links">
              <a href="#social" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#social" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#social" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="#social" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={(e) => scrollToSection(e, '#home', 'home')}>Home</a></li>
              <li><a href="#about" onClick={(e) => scrollToSection(e, '#about', 'about')}>About Our Crew</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services', 'services')}>Plumbing Services</a></li>
              <li><a href="#why-us" onClick={(e) => scrollToSection(e, '#why-us', 'why-us')}>Why Choose Us</a></li>
              <li><a href="#projects" onClick={(e) => scrollToSection(e, '#projects', 'projects')}>Our Projects</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services', 'services')}>Drain & Clog Cleaning</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services', 'services')}>Water Heater Repair</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services', 'services')}>Acoustic Leak Detection</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services', 'services')}>Gas Line Safety Check</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services', 'services')}>Whole Home Repiping</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-contact-item">
              <i className="bi bi-geo-alt"></i>
              <span>24 King Road, Melbourne, Australia</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-telephone"></i>
              <span>8767898767</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-envelope"></i>
              <span>support@valvordplumbing.com</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-clock"></i>
              <span>Open 24/7 / 365 Days</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-content">
            <p>© {new Date().getFullYear()} Valvord Plumbing Services. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <span>•</span>
              <a href="#terms">Terms of Service</a>
              <span>•</span>
              <a href="#licensing">License #PLMB-94021</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Scroll Effects ---
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header background shift on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- Mobile Navigation Menu ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinksWrapper = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinksWrapper) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksWrapper.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksWrapper.classList.remove('active');
      });
    });
  }

  // --- Theme Toggle (Dark / Light Mode) ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme');

  // Check saved theme or user preference
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', defaultTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- FAQ Accordion Animations ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all FAQs first
      faqItems.forEach(faq => {
        faq.classList.remove('active');
      });

      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Intersection Observer (Scroll Reveal) ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Unobserve to trigger only once
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });

  // --- Appointment Booking Logic & Modal ---
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBookingSummary = document.getElementById('modalBookingSummary');

  if (bookingForm && bookingSuccessModal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const email = document.getElementById('patientEmail').value.trim();
      const date = document.getElementById('appointmentDate').value;
      const time = document.getElementById('appointmentTime').value;
      const condition = document.getElementById('medicalCondition').value;

      // Simple Validation
      if (!name || !phone || !date || !time) {
        alert('Please fill out all required fields.');
        return;
      }

      // Populate Success Modal Details
      modalBookingSummary.innerHTML = `
        <strong>Patient:</strong> ${name}<br>
        <strong>Phone:</strong> ${phone}<br>
        <strong>Schedule:</strong> ${date} at ${time}<br>
        <strong>Condition/Department:</strong> ${condition || 'General consultation'}<br><br>
        <span style="color: var(--accent-color); font-weight: bold;">📣 Calling Clinic at 9893457822 to confirm slot availability...</span>
      `;

      // Show Success Modal
      bookingSuccessModal.classList.add('active');

      // Reset Form
      bookingForm.reset();

      // --- Trigger Direct Call ---
      setTimeout(() => {
        window.location.href = "tel:+919893457822";
      }, 1000); // 1-second delay so user sees the modal confirmation first
    });

    // Close Modal Event
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        bookingSuccessModal.classList.remove('active');
      });
    }

    // Close Modal on clicking outside
    bookingSuccessModal.addEventListener('click', (e) => {
      if (e.target === bookingSuccessModal) {
        bookingSuccessModal.classList.remove('active');
      }
    });
  }
});

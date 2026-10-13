/**
 * Portfolio Website Interactions & Functionality
 * Author: Victor Nguyen
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initScrollSpy();
  initSkillBadges();
  initContactForm();
  initProjectInteractions();
  initBackToTop();
  updateCurrentYear();
});

/* ==========================================================================
   1. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-footer .btn');

  if (!menuToggle || !mobileMenu) return;

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
  };

  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  menuToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target) && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. Scroll Spy & Active Nav Highlighting
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktopNav a, .nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const onScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   3. Interactive Skill Badges & Filters
   ========================================================================== */
function initSkillBadges() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillBadges = document.querySelectorAll('.skill-badge');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      skillBadges.forEach(badge => {
        const category = badge.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          badge.classList.remove('dimmed');
        } else {
          badge.classList.add('dimmed');
        }
      });
    });
  });

  // Badge click interaction (tap feedback)
  skillBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const name = badge.querySelector('.badge-name')?.textContent || 'Skill';
      const level = badge.querySelector('.badge-level')?.textContent || '';
      showToast('Skill Highlight', `${name} — ${level} proficiency`, 'info');
    });
  });
}

/* ==========================================================================
   4. Contact Form Validation, Console Logging & Toast Feedback
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const btnIcon = submitBtn.querySelector('.btn-icon');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, errorEl, condition, errorMsg) => {
    if (condition) {
      input.classList.remove('error');
      errorEl.textContent = '';
      return true;
    } else {
      input.classList.add('error');
      errorEl.textContent = errorMsg;
      return false;
    }
  };

  // Real-time clearance on input
  nameInput.addEventListener('input', () => validateField(nameInput, nameError, nameInput.value.trim().length > 0, 'Name is required'));
  emailInput.addEventListener('input', () => validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address'));
  messageInput.addEventListener('input', () => validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Message must be at least 10 characters'));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 0, 'Name is required');
    const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address');
    const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Message must be at least 10 characters');

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      showToast('Validation Error', 'Please correct the highlighted fields before sending.', 'info');
      return;
    }

    const submissionData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim() || 'General Inquiry',
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Requirement 5: Log submission to browser console
    console.group('📬 Contact Form Submission Received');
    console.log('Timestamp:', submissionData.timestamp);
    console.log('Sender Name:', submissionData.name);
    console.log('Sender Email:', submissionData.email);
    console.log('Subject:', submissionData.subject);
    console.log('Message:', submissionData.message);
    console.log('Raw Payload:', submissionData);
    console.groupEnd();

    // Show button loading spinner
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnSpinner.classList.remove('hidden');
    btnIcon.classList.add('hidden');

    // Simulate swift network dispatch
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnSpinner.classList.add('hidden');
      btnIcon.classList.remove('hidden');

      // Success feedback toast
      showToast(
        'Message Sent Successfully!',
        `Thank you ${submissionData.name}. Your message has been recorded and logged.`,
        'success'
      );

      // Reset form fields
      contactForm.reset();
      nameInput.classList.remove('error');
      emailInput.classList.remove('error');
      messageInput.classList.remove('error');
    }, 850);
  });
}

/* ==========================================================================
   5. Project Interactions & Demo Previews
   ========================================================================== */
function initProjectInteractions() {
  const previewButtons = document.querySelectorAll('.preview-btn');
  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.getAttribute('data-project') || 'Project';
      showToast('Live Demo Initializing', `Launching preview environment for ${projectName}...`, 'info');
    });
  });
}

/* ==========================================================================
   6. Toast Notification Manager
   ========================================================================== */
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon" viewBox="0 0 20 20" fill="#10b981" width="20" height="20">
         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
       </svg>`
    : `<svg class="toast-icon" viewBox="0 0 20 20" fill="#06b6d4" width="20" height="20">
         <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
       </svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const dismissToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 350);
  };

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', dismissToast);

  // Auto dismiss after 4.5 seconds
  setTimeout(dismissToast, 4500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   7. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Dynamic Footer Year
   ========================================================================== */
function updateCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

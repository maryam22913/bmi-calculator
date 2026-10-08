// --- Unit Tab Switching ---
const metricTab = document.getElementById('metric-tab');
const imperialTab = document.getElementById('imperial-tab');
const metricInputs = document.getElementById('metric-inputs');
const imperialInputs = document.getElementById('imperial-inputs');

let currentUnit = 'metric';

metricTab.addEventListener('click', () => {
  currentUnit = 'metric';
  metricTab.classList.add('active');
  imperialTab.classList.remove('active');
  metricInputs.classList.remove('hidden');
  imperialInputs.classList.add('hidden');
});

imperialTab.addEventListener('click', () => {
  currentUnit = 'imperial';
  imperialTab.classList.add('active');
  metricTab.classList.remove('active');
  imperialInputs.classList.remove('hidden');
  metricInputs.classList.add('hidden');
});

// --- Gender Selection ---
const genderOptions = document.querySelectorAll('.gender-option');
genderOptions.forEach(option => {
  option.addEventListener('click', () => {
    genderOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
  });
});

// --- Form & BMI Calculation ---
const form = document.getElementById('bmi-form');
const resetBtn = document.getElementById('reset-btn');
const resultBox = document.getElementById('result-box');
const bmiValueEl = document.getElementById('bmi-value');
const bmiCategoryEl = document.getElementById('bmi-category');
const needleEl = document.getElementById('scale-needle');
const adviceCard = document.getElementById('advice-card');
const adviceIcon = document.getElementById('advice-icon');
const adviceText = document.getElementById('advice-text');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let bmi = 0;

  if (currentUnit === 'metric') {
    const heightCm = parseFloat(document.getElementById('height-cm').value);
    const weightKg = parseFloat(document.getElementById('weight-kg').value);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      alert('Meharbani farma kar sahi Height aur Weight darj karein!');
      return;
    }

    const heightM = heightCm / 100;
    bmi = weightKg / (heightM * heightM);
  } else {
    const heightFt = parseFloat(document.getElementById('height-ft').value) || 0;
    const heightIn = parseFloat(document.getElementById('height-in').value) || 0;
    const weightLbs = parseFloat(document.getElementById('weight-lbs').value);

    const totalInches = (heightFt * 12) + heightIn;

    if (totalInches <= 0 || !weightLbs || weightLbs <= 0) {
      alert('Meharbani farma kar sahi Height aur Weight darj karein!');
      return;
    }

    bmi = (703 * weightLbs) / (totalInches * totalInches);
  }

  displayResult(parseFloat(bmi.toFixed(1)));
});

function displayResult(bmi) {
  resultBox.classList.remove('hidden');

  // Smooth number counter
  animateValue(bmiValueEl, 0, bmi, 700);

  let category = '';
  let color = '';
  let icon = '';
  let advice = '';
  let needlePercent = 0;

  if (bmi < 18.5) {
    category = 'Underweight (Kam Wazan)';
    color = '#0284c7';
    icon = '🥗';
    advice = 'Aapka wazan normal se kam hai. Apni diet mein protein aur nutritious khuraak shamil karein!';
    needlePercent = Math.min(Math.max((bmi / 18.5) * 20, 5), 22);
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Normal Weight (Munasib Wazan)';
    color = '#10b981';
    icon = '🌟';
    advice = 'Shabash! Aapka wazan bilkul perfect aur healthy range mein hai. Daily walk aur balanced diet jari rakhein!';
    needlePercent = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = 'Overweight (Ziada Wazan)';
    color = '#f59e0b';
    icon = '⚠️';
    advice = 'Aapka wazan thora ziada hai. Thori rozana exercise karein aur meethi/fried cheezon se parhez karein.';
    needlePercent = 52 + ((bmi - 25) / (29.9 - 25)) * 23;
  } else {
    category = 'Obese (Bohat Ziada Wazan)';
    color = '#ef4444';
    icon = '🚨';
    advice = 'Aapka wazan sehat ke liye khatarnak hadd tak ziada hai. Doctor ya nutritionist se mashwara karein aur regular exercise shuru karein.';
    needlePercent = Math.min(78 + ((bmi - 30) / 10) * 18, 96);
  }

  bmiCategoryEl.textContent = category;
  bmiCategoryEl.style.backgroundColor = color;
  adviceCard.style.borderLeftColor = color;
  adviceIcon.textContent = icon;
  adviceText.textContent = advice;

  setTimeout(() => {
    needleEl.style.left = `${needlePercent}%`;
  }, 100);

  resultBox.scrollIntoView({ behavior: 'smooth' });
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentVal = (progress * (end - start) + start).toFixed(1);
    obj.innerHTML = currentVal;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

resetBtn.addEventListener('click', () => {
  form.reset();
  resultBox.classList.add('hidden');
  needleEl.style.left = '0%';
});

// --- Sign In Modal & Auth State ---
const authModal = document.getElementById('auth-modal');
const openSigninBtn = document.getElementById('open-signin-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const authForm = document.getElementById('auth-form');
const navAuth = document.getElementById('nav-auth');

function updateAuthUI() {
  const savedUser = localStorage.getItem('bmi_user');
  if (savedUser) {
    navAuth.innerHTML = `
      <div class="user-profile">
        <span class="user-badge">👤 ${savedUser}</span>
        <button type="button" class="btn-logout" id="logout-btn">Log Out</button>
      </div>
    `;
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('bmi_user');
        updateAuthUI();
      });
    }
  } else {
    navAuth.innerHTML = `
      <button type="button" class="btn-signin" id="open-signin-btn">
        <span>Sign In</span>
      </button>
    `;
    const newOpenBtn = document.getElementById('open-signin-btn');
    if (newOpenBtn) {
      newOpenBtn.addEventListener('click', openModal);
    }
  }
}

function openModal() {
  authModal.classList.remove('hidden');
}

function closeModal() {
  authModal.classList.add('hidden');
}

if (openSigninBtn) {
  openSigninBtn.addEventListener('click', openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    closeModal();
  }
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userName = document.getElementById('user-name').value.trim();
  if (userName) {
    localStorage.setItem('bmi_user', userName);
    updateAuthUI();
    closeModal();
    authForm.reset();
  }
});

// Initialize Auth state
updateAuthUI();

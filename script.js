// --- State Variables ---
let currentUnit = 'metric';
let currentGender = 'male';
let currentMode = 'adult'; // 'adult' or 'child'

// DOM Elements: Mode Switcher
const modeAdultBtn = document.getElementById('mode-adult-btn');
const modeChildBtn = document.getElementById('mode-child-btn');
const calcPanelTitle = document.getElementById('calc-panel-title');
const ageInput = document.getElementById('age-input');
const ageBadge = document.getElementById('age-badge');
const ageLabel = document.getElementById('age-label');
const textMale = document.getElementById('text-male');
const textFemale = document.getElementById('text-female');
const iconMale = document.getElementById('icon-male');
const iconFemale = document.getElementById('icon-female');
const maleCard = document.getElementById('gender-male-label');
const femaleCard = document.getElementById('gender-female-label');
const childPercentileBadge = document.getElementById('child-percentile-badge');
const tableCardTitle = document.getElementById('table-card-title');
const bmiTableBody = document.getElementById('bmi-table-body');
const scoreHeadingLabel = document.getElementById('score-heading-label');

// DOM Elements: Tabs & Groups
const tabMetric = document.getElementById('tab-metric');
const tabImperial = document.getElementById('tab-imperial');
const heightMetricGroup = document.getElementById('height-metric-group');
const heightImperialGroup = document.getElementById('height-imperial-group');
const weightMetricGroup = document.getElementById('weight-metric-group');
const weightImperialGroup = document.getElementById('weight-imperial-group');

// Metric Inputs
const heightCmInput = document.getElementById('height-cm');
const heightCmSlider = document.getElementById('height-cm-slider');
const heightCmDisplay = document.getElementById('height-cm-display');

const weightKgInput = document.getElementById('weight-kg');
const weightKgSlider = document.getElementById('weight-kg-slider');
const weightKgDisplay = document.getElementById('weight-kg-display');

// Imperial Inputs
const heightFtInput = document.getElementById('height-ft');
const heightInInput = document.getElementById('height-in');
const weightLbsInput = document.getElementById('weight-lbs');
const weightLbsSlider = document.getElementById('weight-lbs-slider');
const weightLbsDisplay = document.getElementById('weight-lbs-display');

// Results Elements
const bmiScoreEl = document.getElementById('bmi-score');
const statusPill = document.getElementById('status-pill');
const gaugeMarker = document.getElementById('gauge-marker');
const markerBubble = document.getElementById('marker-bubble');

const idealRangeVal = document.getElementById('ideal-range-val');
const idealRangeExplanation = document.getElementById('ideal-range-explanation');
const weightDiffVal = document.getElementById('weight-diff-val');
const weightDiffSub = document.getElementById('weight-diff-sub');
const bmrVal = document.getElementById('bmr-val');
const waterVal = document.getElementById('water-val');
const ponderalVal = document.getElementById('ponderal-val');

// WHO Table Rows (dynamic)
let tableRows = {
  under: document.getElementById('row-under'),
  normal: document.getElementById('row-normal'),
  over: document.getElementById('row-over'),
  obese1: document.getElementById('row-obese1'),
  obese2: document.getElementById('row-obese2')
};

// History Elements
const saveHistoryBtn = document.getElementById('save-history-btn');
const saveFeedback = document.getElementById('save-feedback');
const historySection = document.getElementById('history-section');
const historyItems = document.getElementById('history-items');

// --- Mode Switcher (Adult vs Child/Teen) ---
modeAdultBtn.addEventListener('click', () => {
  if (currentMode === 'adult') return;
  currentMode = 'adult';
  modeAdultBtn.classList.add('active');
  modeChildBtn.classList.remove('active');

  calcPanelTitle.textContent = 'Adult Body Parameters (kg / cm)';
  scoreHeadingLabel.textContent = 'YOUR BODY MASS INDEX (BMI)';
  ageLabel.textContent = 'Age (Years)';
  ageInput.min = '20';
  ageInput.max = '120';
  ageInput.value = '25';
  ageBadge.textContent = 'Adult (20+)';

  textMale.textContent = 'Male';
  textFemale.textContent = 'Female';
  iconMale.textContent = '👨';
  iconFemale.textContent = '👩';

  childPercentileBadge.classList.add('hidden');
  tableCardTitle.textContent = 'WHO BMI Classification Standard';

  // Restore Adult WHO Table
  renderAdultTable();

  // Reset to adult defaults if child values were present
  if (parseFloat(heightCmInput.value) < 140) {
    heightCmInput.value = 170;
    heightCmSlider.value = 170;
    heightCmDisplay.textContent = '170 cm';
  }
  if (parseFloat(weightKgInput.value) < 45) {
    weightKgInput.value = 68;
    weightKgSlider.value = 68;
    weightKgDisplay.textContent = '68 kg';
  }

  calculateBMI();
});

modeChildBtn.addEventListener('click', () => {
  if (currentMode === 'child') return;
  currentMode = 'child';
  modeChildBtn.classList.add('active');
  modeAdultBtn.classList.remove('active');

  calcPanelTitle.textContent = 'Child & Teen Parameters (Ages 2–19)';
  scoreHeadingLabel.textContent = 'PEDIATRIC BMI & PERCENTILE';
  ageLabel.textContent = 'Age (2 to 19 Years)';
  ageInput.min = '2';
  ageInput.max = '19';
  ageInput.value = '12';
  ageBadge.textContent = 'Child / Teen (2–19)';

  textMale.textContent = 'Boy (Larka)';
  textFemale.textContent = 'Girl (Larki)';
  iconMale.textContent = '👦';
  iconFemale.textContent = '👧';

  childPercentileBadge.classList.remove('hidden');
  tableCardTitle.textContent = 'CDC / WHO Pediatric Growth Percentiles';

  // Render Pediatric Table
  renderChildTable();

  // Adjust inputs for typical 12-year-old
  heightCmInput.value = 148;
  heightCmSlider.value = 148;
  heightCmDisplay.textContent = '148 cm';

  weightKgInput.value = 42;
  weightKgSlider.value = 42;
  weightKgDisplay.textContent = '42 kg';

  calculateBMI();
});

function renderAdultTable() {
  bmiTableBody.innerHTML = `
    <tr id="row-under">
      <td><span class="dot dot-under"></span> Underweight</td>
      <td>&lt; 18.5</td>
      <td>Malnutrition / low immunity</td>
    </tr>
    <tr id="row-normal" class="active-row">
      <td><span class="dot dot-normal"></span> Normal Weight</td>
      <td>18.5 – 24.9</td>
      <td>Lowest health risks</td>
    </tr>
    <tr id="row-over">
      <td><span class="dot dot-over"></span> Overweight</td>
      <td>25.0 – 29.9</td>
      <td>Moderate heart/joint risk</td>
    </tr>
    <tr id="row-obese1">
      <td><span class="dot dot-obese1"></span> Obesity Class I</td>
      <td>30.0 – 34.9</td>
      <td>High risk of diabetes & BP</td>
    </tr>
    <tr id="row-obese2">
      <td><span class="dot dot-obese2"></span> Severe Obesity</td>
      <td>≥ 35.0</td>
      <td>Extremely high health risk</td>
    </tr>
  `;
  refreshTableRowRefs();
}

function renderChildTable() {
  bmiTableBody.innerHTML = `
    <tr id="row-under">
      <td><span class="dot dot-under"></span> Underweight</td>
      <td>&lt; 5th Percentile</td>
      <td>Possible growth or nutrient deficiency</td>
    </tr>
    <tr id="row-normal" class="active-row">
      <td><span class="dot dot-normal"></span> Healthy Weight</td>
      <td>5th to 84th Percentile</td>
      <td>Optimal growth & physical development</td>
    </tr>
    <tr id="row-over">
      <td><span class="dot dot-over"></span> Overweight</td>
      <td>85th to 94th Percentile</td>
      <td>Elevated risk of adolescent weight issues</td>
    </tr>
    <tr id="row-obese1">
      <td><span class="dot dot-obese1"></span> Obesity</td>
      <td>≥ 95th Percentile</td>
      <td>Pediatrician consultation recommended</td>
    </tr>
    <tr id="row-obese2">
      <td><span class="dot dot-obese2"></span> Severe Obesity</td>
      <td>≥ 99th Percentile</td>
      <td>High clinical monitoring required</td>
    </tr>
  `;
  refreshTableRowRefs();
}

function refreshTableRowRefs() {
  tableRows = {
    under: document.getElementById('row-under'),
    normal: document.getElementById('row-normal'),
    over: document.getElementById('row-over'),
    obese1: document.getElementById('row-obese1'),
    obese2: document.getElementById('row-obese2')
  };
}

// --- Unit Switching ---
tabMetric.addEventListener('click', () => {
  if (currentUnit === 'metric') return;
  currentUnit = 'metric';
  tabMetric.classList.add('active');
  tabImperial.classList.remove('active');

  heightMetricGroup.classList.remove('hidden');
  heightImperialGroup.classList.add('hidden');
  weightMetricGroup.classList.remove('hidden');
  weightImperialGroup.classList.add('hidden');

  // Convert imperial values back to metric
  const totalIn = (parseFloat(heightFtInput.value) || 0) * 12 + (parseFloat(heightInInput.value) || 0);
  if (totalIn > 0) {
    const cm = Math.round(totalIn * 2.54);
    heightCmInput.value = cm;
    heightCmSlider.value = cm;
    heightCmDisplay.textContent = `${cm} cm`;
  }
  const lbs = parseFloat(weightLbsInput.value) || 0;
  if (lbs > 0) {
    const kg = parseFloat((lbs / 2.20462).toFixed(1));
    weightKgInput.value = kg;
    weightKgSlider.value = kg;
    weightKgDisplay.textContent = `${kg} kg`;
  }

  calculateBMI();
});

tabImperial.addEventListener('click', () => {
  if (currentUnit === 'imperial') return;
  currentUnit = 'imperial';
  tabImperial.classList.add('active');
  tabMetric.classList.remove('active');

  heightMetricGroup.classList.add('hidden');
  heightImperialGroup.classList.remove('hidden');
  weightMetricGroup.classList.add('hidden');
  weightImperialGroup.classList.remove('hidden');

  // Convert metric values to imperial
  const cm = parseFloat(heightCmInput.value) || 170;
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  heightFtInput.value = ft;
  heightInInput.value = inches;

  const kg = parseFloat(weightKgInput.value) || 68;
  const lbs = Math.round(kg * 2.20462);
  weightLbsInput.value = lbs;
  weightLbsSlider.value = lbs;
  weightLbsDisplay.textContent = `${lbs} lbs`;

  calculateBMI();
});

// --- Two-Way Sliders & Number Sync ---
function syncMetricHeight(fromSlider) {
  if (fromSlider) {
    heightCmInput.value = heightCmSlider.value;
  } else {
    heightCmSlider.value = heightCmInput.value;
  }
  heightCmDisplay.textContent = `${heightCmInput.value} cm`;
  calculateBMI();
}

heightCmSlider.addEventListener('input', () => syncMetricHeight(true));
heightCmInput.addEventListener('input', () => syncMetricHeight(false));

function syncMetricWeight(fromSlider) {
  if (fromSlider) {
    weightKgInput.value = weightKgSlider.value;
  } else {
    weightKgSlider.value = weightKgInput.value;
  }
  weightKgDisplay.textContent = `${weightKgInput.value} kg`;
  calculateBMI();
}

weightKgSlider.addEventListener('input', () => syncMetricWeight(true));
weightKgInput.addEventListener('input', () => syncMetricWeight(false));

function syncImperialWeight(fromSlider) {
  if (fromSlider) {
    weightLbsInput.value = weightLbsSlider.value;
  } else {
    weightLbsSlider.value = weightLbsInput.value;
  }
  weightLbsDisplay.textContent = `${weightLbsInput.value} lbs`;
  calculateBMI();
}

weightLbsSlider.addEventListener('input', () => syncImperialWeight(true));
weightLbsInput.addEventListener('input', () => syncImperialWeight(false));

heightFtInput.addEventListener('input', calculateBMI);
heightInInput.addEventListener('input', calculateBMI);

// --- Age & Gender Handlers ---
ageInput.addEventListener('input', () => {
  const age = parseInt(ageInput.value) || 25;
  if (currentMode === 'child') {
    ageBadge.textContent = `Ages ${age} Yrs (Child/Teen)`;
  } else {
    if (age < 20) {
      ageBadge.textContent = 'Youth (< 20)';
    } else if (age >= 65) {
      ageBadge.textContent = 'Senior (65+)';
    } else {
      ageBadge.textContent = 'Adult (20+)';
    }
  }
  calculateBMI();
});

maleCard.addEventListener('click', () => {
  currentGender = 'male';
  maleCard.classList.add('active');
  femaleCard.classList.remove('active');
  calculateBMI();
});

femaleCard.addEventListener('click', () => {
  currentGender = 'female';
  femaleCard.classList.add('active');
  maleCard.classList.remove('active');
  calculateBMI();
});

// --- Pediatric Percentile Estimation Formula (CDC Reference Curve) ---
function estimateChildPercentile(bmi, age, gender) {
  // Approximate CDC Median 50th percentile BMI by age for boys and girls
  const medianBoy = [16.5, 16.5, 15.8, 15.3, 15.2, 15.3, 15.5, 15.8, 16.2, 16.6, 17.2, 17.8, 18.5, 19.2, 19.9, 20.6, 21.4, 22.0, 22.5, 22.8];
  const medianGirl = [16.2, 16.2, 15.4, 15.1, 15.0, 15.2, 15.4, 15.8, 16.3, 17.0, 17.7, 18.5, 19.3, 20.1, 20.8, 21.3, 21.7, 22.0, 22.2, 22.5];

  const index = Math.min(Math.max(Math.round(age), 2), 19);
  const m = gender === 'male' ? medianBoy[index] : medianGirl[index];
  const sd = 2.2; // average standard deviation across pediatric cohorts

  // Z-score calculation
  const z = (bmi - m) / sd;

  // Cumulative standard normal distribution approximation
  const p = 1 / (1 + Math.exp(-1.7 * z));
  const percentile = Math.min(Math.max(Math.round(p * 100), 1), 99);
  return percentile;
}

// --- Calculation Core ---
function calculateBMI() {
  let heightM = 0;
  let weightKg = 0;

  if (currentUnit === 'metric') {
    const cm = parseFloat(heightCmInput.value) || 0;
    weightKg = parseFloat(weightKgInput.value) || 0;
    heightM = cm / 100;
  } else {
    const ft = parseFloat(heightFtInput.value) || 0;
    const inch = parseFloat(heightInInput.value) || 0;
    const totalInches = (ft * 12) + inch;
    heightM = (totalInches * 2.54) / 100;
    const lbs = parseFloat(weightLbsInput.value) || 0;
    weightKg = lbs / 2.20462;
  }

  if (heightM <= 0 || weightKg <= 0) return;

  const bmi = weightKg / (heightM * heightM);
  const formattedBMI = parseFloat(bmi.toFixed(1));
  const age = parseInt(ageInput.value) || 25;

  // 1. Update BMI Number
  bmiScoreEl.textContent = formattedBMI;
  markerBubble.textContent = formattedBMI;

  // 2. Determine Category & Status Styling (Adult vs Child)
  let statusClass = 'status-normal';
  let categoryName = 'Normal Weight';
  let activeRowKey = 'normal';

  if (currentMode === 'child') {
    const percentile = estimateChildPercentile(formattedBMI, age, currentGender);
    childPercentileBadge.textContent = `${percentile}th Percentile (for ${age} yr old ${currentGender === 'male' ? 'boy' : 'girl'})`;

    if (percentile < 5) {
      statusClass = 'status-under';
      categoryName = 'Underweight (<5th %ile)';
      activeRowKey = 'under';
    } else if (percentile >= 5 && percentile < 85) {
      statusClass = 'status-normal';
      categoryName = 'Healthy Weight (5th–84th %ile)';
      activeRowKey = 'normal';
    } else if (percentile >= 85 && percentile < 95) {
      statusClass = 'status-over';
      categoryName = 'Overweight (85th–94th %ile)';
      activeRowKey = 'over';
    } else if (percentile >= 95 && percentile < 99) {
      statusClass = 'status-obese1';
      categoryName = 'Obese (≥95th %ile)';
      activeRowKey = 'obese1';
    } else {
      statusClass = 'status-obese2';
      categoryName = 'Severe Obesity (≥99th %ile)';
      activeRowKey = 'obese2';
    }
  } else {
    // Adult standard
    if (bmi < 18.5) {
      statusClass = 'status-under';
      categoryName = 'Underweight';
      activeRowKey = 'under';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      statusClass = 'status-normal';
      categoryName = 'Normal Weight';
      activeRowKey = 'normal';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      statusClass = 'status-over';
      categoryName = 'Overweight';
      activeRowKey = 'over';
    } else if (bmi >= 30.0 && bmi <= 34.9) {
      statusClass = 'status-obese1';
      categoryName = 'Obesity Class I';
      activeRowKey = 'obese1';
    } else {
      statusClass = 'status-obese2';
      categoryName = 'Severe Obesity';
      activeRowKey = 'obese2';
    }
  }

  statusPill.className = `status-pill ${statusClass}`;
  statusPill.textContent = categoryName;

  // 3. Highlight Table Row
  Object.keys(tableRows).forEach(key => {
    if (tableRows[key]) {
      tableRows[key].classList.remove('active-row');
    }
  });
  if (tableRows[activeRowKey]) {
    tableRows[activeRowKey].classList.add('active-row');
  }

  // 4. Update Gauge Marker Position
  let markerPercent = 35;
  if (bmi < 18.5) {
    markerPercent = Math.max(5, (bmi / 18.5) * 22);
  } else if (bmi < 25.0) {
    markerPercent = 23 + ((bmi - 18.5) / (25.0 - 18.5)) * 27;
  } else if (bmi < 30.0) {
    markerPercent = 50 + ((bmi - 25.0) / (30.0 - 25.0)) * 25;
  } else if (bmi < 35.0) {
    markerPercent = 75 + ((bmi - 30.0) / (35.0 - 30.0)) * 13;
  } else {
    markerPercent = Math.min(96, 88 + ((bmi - 35.0) / 10) * 8);
  }
  gaugeMarker.style.left = `${markerPercent}%`;

  // 5. Healthy Weight Range Spotlight calculation in kg
  const minHealthyKg = (18.5 * heightM * heightM).toFixed(1);
  const maxHealthyKg = (24.9 * heightM * heightM).toFixed(1);

  if (currentUnit === 'metric') {
    idealRangeVal.textContent = `${minHealthyKg} kg – ${maxHealthyKg} kg`;
    idealRangeExplanation.textContent = `Aapke qad (${Math.round(heightM * 100)} cm) ke hisab se sehat mand wazan ${minHealthyKg} kg se ${maxHealthyKg} kg ke darmian hona chahiye.`;
  } else {
    const minHealthyLbs = Math.round(minHealthyKg * 2.20462);
    const maxHealthyLbs = Math.round(maxHealthyKg * 2.20462);
    idealRangeVal.textContent = `${minHealthyKg} kg (${minHealthyLbs} lbs) – ${maxHealthyKg} kg (${maxHealthyLbs} lbs)`;
    idealRangeExplanation.textContent = `For your height, the healthy range is ${minHealthyKg} kg – ${maxHealthyKg} kg.`;
  }

  // 6. Weight Target Difference
  if (bmi < 18.5) {
    const diff = (minHealthyKg - weightKg).toFixed(1);
    weightDiffVal.textContent = `+${diff} kg required`;
    weightDiffSub.textContent = 'Gain weight to reach normal';
  } else if (bmi > 24.9) {
    const diff = (weightKg - maxHealthyKg).toFixed(1);
    weightDiffVal.textContent = `-${diff} kg to lose`;
    weightDiffSub.textContent = 'Lose weight to reach normal';
  } else {
    weightDiffVal.textContent = 'Within healthy range';
    weightDiffSub.textContent = 'Bilkull perfect balance!';
  }

  // 7. Estimated Daily Calories (BMR Mifflin-St Jeor)
  const heightCm = heightM * 100;
  let bmr = 0;
  if (currentGender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  const maintenanceCalories = Math.round(bmr * 1.375);
  bmrVal.textContent = `~${maintenanceCalories.toLocaleString()} kcal`;

  // 8. Water intake estimate (35ml per kg)
  const waterLiters = (weightKg * 0.035).toFixed(1);
  waterVal.textContent = `${waterLiters} Liters`;

  // 9. Ponderal Index (Corpulence Index = kg / m^3)
  const ponderal = (weightKg / (heightM * heightM * heightM)).toFixed(1);
  ponderalVal.textContent = `${ponderal} kg/m³`;
}

// Reset button
document.getElementById('reset-all-btn').addEventListener('click', () => {
  if (currentMode === 'child') {
    heightCmInput.value = 148;
    heightCmSlider.value = 148;
    heightCmDisplay.textContent = '148 cm';

    weightKgInput.value = 42;
    weightKgSlider.value = 42;
    weightKgDisplay.textContent = '42 kg';

    ageInput.value = 12;
    ageBadge.textContent = 'Child / Teen (2–19)';
  } else {
    heightCmInput.value = 170;
    heightCmSlider.value = 170;
    heightCmDisplay.textContent = '170 cm';

    weightKgInput.value = 68;
    weightKgSlider.value = 68;
    weightKgDisplay.textContent = '68 kg';

    ageInput.value = 25;
    ageBadge.textContent = 'Adult (20+)';
  }

  calculateBMI();
});

// Form submit prevent default
document.getElementById('bmi-form').addEventListener('submit', (e) => {
  e.preventDefault();
  calculateBMI();
});

// --- History Feature ---
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('bmi_history') || '[]');
  if (history.length > 0) {
    historySection.classList.remove('hidden');
    historyItems.innerHTML = history.slice(0, 5).map(item => `
      <div class="history-item">
        <span><strong>BMI: ${item.bmi}</strong> (${item.category} - ${item.mode || 'Adult'})</span>
        <span style="color: var(--text-muted);">${item.date}</span>
      </div>
    `).join('');
  } else {
    historySection.classList.add('hidden');
  }
}

saveHistoryBtn.addEventListener('click', () => {
  const bmi = bmiScoreEl.textContent;
  const category = statusPill.textContent;
  const mode = currentMode === 'child' ? 'Child/Teen' : 'Adult';
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const history = JSON.parse(localStorage.getItem('bmi_history') || '[]');
  history.unshift({ bmi, category, mode, date });
  localStorage.setItem('bmi_history', JSON.stringify(history.slice(0, 10)));

  saveFeedback.classList.remove('hidden');
  setTimeout(() => saveFeedback.classList.add('hidden'), 2500);

  loadHistory();
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

if (openSigninBtn) openSigninBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeModal();
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

// --- Interactive FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const questionBtn = item.querySelector('.faq-question');
  if (questionBtn) {
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  }
});

// --- Initial Launch ---
updateAuthUI();
loadHistory();
calculateBMI();

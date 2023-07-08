const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderInput = document.querySelector('.slider-input');
const sliderTrack = document.querySelector('.slider-track');
const sliderThumb = document.querySelector('.slider-thumb');
const sliderThumbImage = document.querySelector('.slider-thumb-image');
  
const minValue = +sliderInput.min || 0;
const maxValue = +sliderInput.max || 100;

const colorStops = [
  { r: 98, g: 173, b: 29 },
  { r: 251, g: 189, b: 30 },
  { r: 251, g: 110, b: 30 },
  { r: 231, g: 26, b: 26 },
];

const setSliderThumbImageColor = (progress) => {
  const index = (colorStops.length - 1) * progress / 100;
  const startIndex = Math.floor(index);
  const endIndex = Math.ceil(index);

  const startColor = colorStops[startIndex];
  const endColor = colorStops[endIndex];

  const percentage = index - startIndex;

  const [r, g, b] = [
    Math.round(startColor.r + (endColor.r - startColor.r) * percentage),
    Math.round(startColor.g + (endColor.g - startColor.g) * percentage),
    Math.round(startColor.b + (endColor.b - startColor.b) * percentage)
  ];

  sliderThumbImage.style.setProperty('--slider-thumb-image-color', `rgb(${r} ${g} ${b})`);
};

const updateSlider = () => {
  const progress = 100 * +sliderInput.value / (maxValue - minValue);
  sliderWrapper.style.setProperty('--slider-progress', progress);
  setSliderThumbImageColor(progress);
}

sliderInput.addEventListener('input', updateSlider);

updateSlider();

let pointerHoldingRightTimer;
let isTimerRunning = false;

const detectPointerHoldingRight = (event) => {
  const isSliderAtMax = +sliderInput.value === maxValue;
  
  const sliderRect = sliderWrapper.getBoundingClientRect();
  const pointerX = event.clientX;
  const offset = 40;
  const isPointerOnSliderRight = pointerX >= (sliderRect.right + offset);
  
  if (isSliderAtMax && isPointerOnSliderRight) {
    if (!isTimerRunning) {
      isTimerRunning = true;
      sliderThumbImage.classList.add('shake');
      pointerHoldingRightTimer = setTimeout(() => {
        sliderInput.removeEventListener('pointerdown', detectSecret);
        colorStops.push({ r: 34, g: 0, b: 0 });
        sliderWrapper.classList.add('unlocked');
        sliderThumb.addEventListener('animationend', () => {
          sliderThumb.classList.remove('play-explosion');
        });
        sliderThumb.classList.add('play-explosion');
        setSliderThumbImageColor(100);
        sliderThumbImage.classList.remove('shake');
      }, 1000); 
    }
  } else {
    clearTimeout(pointerHoldingRightTimer);
    isTimerRunning = false;
    sliderThumbImage.classList.remove('shake');
  }
};

const detectSecret = () => {
  window.addEventListener('pointermove', detectPointerHoldingRight);
  sliderInput.addEventListener('pointerup', () => {
    window.removeEventListener('pointermove', detectPointerHoldingRight);
    clearTimeout(pointerHoldingRightTimer);
    sliderThumbImage.classList.remove('shake');
  });
}

sliderInput.addEventListener('pointerdown', detectSecret);
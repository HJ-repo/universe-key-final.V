// 초기 화면 로드 시 저장된 이미지 제거
window.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("userImage");
  localStorage.removeItem("userName");
  localStorage.removeItem("userMood");
  localStorage.removeItem("userColor", color);
  localStorage.removeItem("userValue", value);
  localStorage.removeItem("userPersonality", pers);

});

//~~

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticle() {
  const angle = Math.random() * Math.PI * 2;

  const h1 = document.querySelector('h1');
  const rect = h1.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const radiusX = 300; // 타원 가로
  const radiusY = 100;  // 타원 세로

  const x = centerX + radiusX * Math.cos(angle);
  const y = centerY + radiusY * Math.sin(angle);

  const speed = Math.random() * 2 + 0.1;
  const vx = (x - centerX) * 0.02 * speed;
  const vy = (y - centerY) * 0.02 * speed;

  return {
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    radius: Math.random() * 2 + 1,
    opacity: 1
  };
}


function updateParticles() {
  for (let i = 0; i < 5; i++) {
    particles.push(createParticle());
  }

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.opacity -= 0.02;
  });

  if (particles.length > 2000) {
    particles.splice(0, particles.length - 2000);
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(116, 126, 140, ${p.opacity})`; // 검정 입자
    ctx.fill();
  });
}

function animate() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

animate();


//~

let userName = "";
let mood = "";
let color = "";
let value = "";
let pers = ""; // 여기도 변수명이 일관성 있게 맞추자!
let imageFile = null;

function goToScreen(number) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(`screen${number}`).classList.remove('hidden');

  if (number === 8) {
    // 이름과 기분 수집
    userName = document.getElementById('username').value;

    //~~
    const fileInput = document.getElementById('userImage');
    const file = fileInput?.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        localStorage.setItem("userImage", e.target.result); // Data URL 저장
        localStorage.setItem("userName", userName);
        localStorage.setItem("userMood", mood);
        localStorage.setItem("userColor", color);
        localStorage.setItem("userValue", value);
        localStorage.setItem("userPersonality", pers);
        moveToArtPage();
      };
      reader.readAsDataURL(file);
    } else {
      moveToArtPage();
    }
  }

  localStorage.setItem("userName", userName);
  localStorage.setItem("userMood", mood);
  localStorage.setItem("userColor", color);
  localStorage.setItem("userValue", value);
  localStorage.setItem("userPersonality", pers);

  function moveToArtPage() {
    setTimeout(() => {
      window.location.href = "web_art.html";
    }, 2000);
  }
  
  
}

function selectMood(m, el) {
  mood = m;
  // 모든 버튼에서 selected 제거
  updateSelection('#moodButtons button', el);
}
function selectColor(c, el) {
  color = c;
  updateSelection('#colorButtons button', el);
}
function selectValue(v, el) {
  value = v;
  updateSelection('#valueButtons button', el);
}
function selectPers(p, el) {
  pers = p;
  updateSelection('#personalityButtons button', el);
}

function updateSelection(selector, el) {
  document.querySelectorAll(selector).forEach(btn => btn.classList.remove('selected'));
  el.classList.add('selected');
}

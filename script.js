// 초기 화면 로드 시 저장된 이미지 제거
window.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("userImage");
  localStorage.removeItem("userName");
  localStorage.removeItem("userMood");
  localStorage.removeItem("userColor", color);
  localStorage.removeItem("userValue", value);
  localStorage.removeItem("userPersonality", pers);

});


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
  //~

  
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

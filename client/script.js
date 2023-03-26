import bot from "./public/assets/bot.svg";
import user from "./public/assets/user.svg";

const form = document.querySelector("form");
let chatContainer = document.querySelector("#chat_container");
const app = document.querySelector("#app");

let loadInteval;

////////////////////////////
// Chat Pre-Loader
function preLoader(element) {
  element.textContent = "";

  loadInteval = setInterval(() => {
    element.textContent += ".";
    element.style.color = "#fff";
    if (element.textContent === "....") element.textContent = "";
  }, 300);
  // console.log(loadInteval);
}

// Chat Pre-Loader RUN
// preLoader(chatContainer);

////////////////////////////
//
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 40);
}



////////////////////////////
// Generate Uniqe Id
function generateUniqeId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timeStamp}-${hexadecimalString}`;
}

generateUniqeId();

function chatStripe(isAi, value, UniqeId) {
  return `
  <div class='wrapper ${isAi && "ai"}'>
   <div class='chat'>
      <div class='profile'>
       <img
            srs='${isAi ? bot : user}
            alt='${isAi ? "bot" : "user"}
      }'
      />  
       </div>
      <div class='message' id='${UniqeId}'> ${value}</div>
    </div>
  </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // Bot Stripe
  const uniqeId = generateUniqeId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqeId)
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqeId);
  
  preLoader(messageDiv)
};

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', e => {
  if(e.keyCode === 13) handleSubmit(e)
})
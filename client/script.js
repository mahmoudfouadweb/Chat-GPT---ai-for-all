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

////////////////////////////
// Generate chat Stripe
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

////////////////////////////
// Submit action
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // Bot Stripe
  const uniqeId = generateUniqeId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqeId);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqeId);

  preLoader(messageDiv);

  ////////////////////////////
  // fetch data from server -> bot's response

  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInteval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) handleSubmit(e);
});

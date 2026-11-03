const phoneInput = document.getElementById("phone");
const loginBtn = document.getElementById("loginBtn");
const loginScreen = document.getElementById("loginScreen");
const profileScreen = document.getElementById("profileScreen");

const profileName = document.getElementById("profileName");
const profilePhoto = document.getElementById("profilePhoto");
const saveProfileBtn = document.getElementById("saveProfileBtn");

const profileDisplay = document.getElementById("profileDisplay");
const showName = document.getElementById("showName");
const showPhone = document.getElementById("showPhone");
const showPhoto = document.getElementById("showPhoto");

let currentUser = null;

loginBtn.addEventListener("click", () => {
  const phone = phoneInput.value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Enter valid 10 digit mobile number");
    return;
  }

  currentUser = { phone: "+91" + phone };

  loginScreen.hidden = true;
  profileScreen.hidden = false;

  alert("SHANU Demo Login Successful!");
});

saveProfileBtn.addEventListener("click", () => {
  const name = profileName.value.trim();

  if (!name || !currentUser) {
    alert("Please enter your name");
    return;
  }

  const file = profilePhoto.files[0];

  function saveData(photo) {
    const profile = {
      name: name,
      phone: currentUser.phone,
      photo: photo
    };

    localStorage.setItem("shanuProfile", JSON.stringify(profile));

    showName.textContent = profile.name;
    showPhone.textContent = profile.phone;

    if (photo) {
      showPhoto.src = photo;
    }

    profileDisplay.hidden = false;
    alert("SHANU Profile Saved Successfully!");
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = () => saveData(reader.result);
    reader.readAsDataURL(file);
  } else {
    saveData("");
  }
});
// SHANU Chat Connection
const socket = io();

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");

function sendMessage() {
  const message = messageInput.value.trim();

  if (message === "") return;

  socket.emit("chat message", message);
  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

socket.on("chat message", (message) => {
  const msg = document.createElement("p");
  msg.textContent = message;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
const openChatBtn = document.getElementById("openChatBtn");
const chatScreen = document.getElementById("chatScreen");

openChatBtn.addEventListener("click", () => {
  profileScreen.hidden = true;
  chatScreen.hidden = false;
});

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
let activeRoom = null;

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
      name,
      phone: currentUser.phone,
      photo
    };

    localStorage.setItem("shanuProfile", JSON.stringify(profile));

    showName.textContent = profile.name;
    showPhone.textContent = profile.phone;

    if (photo) showPhoto.src = photo;

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

const socket = io();

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");
const receiverPhone = document.getElementById("receiverPhone");

const openChatBtn = document.getElementById("openChatBtn");
const chatScreen = document.getElementById("chatScreen");

openChatBtn.addEventListener("click", () => {
  profileScreen.hidden = true;
  chatScreen.hidden = false;
});

function joinPrivateRoom() {
  const receiver = receiverPhone.value.trim();
alert("You entered: [" + receiver + "] Length: " + receiver.length);
  if (!/^[0-9]{10}$/.test(receiver)) {
    alert("Enter friend's 10 digit number");
    return;
  }

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const receiverFull = "+91" + receiver;

  if (receiverFull === currentUser.phone) {
    alert("Enter a different mobile number");
    return;
  }

  const members = [currentUser.phone, receiverFull].sort();
  activeRoom = members.join("_");

  socket.emit("join room", activeRoom);
  chatMessages.textContent = "Private room connected!";
}
const startChatBtn = document.getElementById("startChatBtn");

startChatBtn.addEventListener("click", () => {
  joinPrivateRoom();
});

function sendMessage() {
  const message = messageInput.value.trim();

  if (!message) return;

  if (!activeRoom) {
    alert("First enter friend's number and press Enter");
    return;
  }

  socket.emit("private message", {
    roomId: activeRoom,
    message,
    sender: currentUser.phone
  });

  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
});

socket.on("private message", (data) => {
  const msg = document.createElement("p");
  msg.textContent = data.sender + ": " + data.message;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

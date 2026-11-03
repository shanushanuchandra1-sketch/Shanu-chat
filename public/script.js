const phoneInput = document.getElementById("phone");
const loginBtn = document.getElementById("loginBtn");
const loginScreen = document.getElementById("loginScreen");
const profileScreen = document.getElementById("profileScreen");
const chatListScreen = document.getElementById("chatListScreen");
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
socket.emit("user online", currentUser.phone);
  loginScreen.hidden = true;
  profileScreen.hidden = false;

  alert(" Login Successful!");
});

saveProfileBtn.addEventListener("click", () => {
  const name = profileName.value.trim();

  if (!name || !currentUser) {
    alert("Please enter your name");
    return;
  }

  const file = profilePhoto.files[0];
if (file && file.size > 2 * 1024 * 1024) {
    alert("Photo size must be less than 2 MB");
    profilePhoto.value = "";
    return;
}

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
const profilePhotoInput = document.getElementById("profilePhoto");

profilePhotoInput.addEventListener("change", () => {
    const file = profilePhotoInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            document.getElementById("showPhoto").src = event.target.result;
        };

        reader.readAsDataURL(file);
  }
 });




const savedProfile = JSON.parse(localStorage.getItem("shanuProfile"));

if (savedProfile) {
    showName.textContent = savedProfile.name;
    showPhone.textContent = savedProfile.phone;

    if (savedProfile.photo) {
        showPhoto.src = savedProfile.photo;
    }

    profileDisplay.hidden = false;
}


document.getElementById("newChatBtn").addEventListener("click", () => {
    chatListScreen.hidden = true;
    chatScreen.hidden = false;

    receiverPhone.style.display = "block";
    startChatBtn.style.display = "block";

    receiverPhone.value = "";
    document.getElementById("friendName").textContent = "New Chat";
    document.getElementById("friendStatus").textContent = "";
});
document.getElementById("backToChatsBtn").addEventListener("click", () => {
    chatScreen.hidden = true;
    chatListScreen.hidden = false;
});

let onlineUsers = [];

socket.on("online users", (users) => {
    onlineUsers = users;

const friendStatus = document.getElementById("friendStatus");
const receiver = receiverPhone.value.trim();
const friendPhone = "+91" + receiver;

if (onlineUsers.includes(friendPhone)) {
    friendStatus.textContent = "● Online";
    friendStatus.style.color = "green";
} else {
    friendStatus.textContent = "● Offline";
    friendStatus.style.color = "gray";
}

    document.querySelectorAll("#chatList div").forEach((item) => {
        const phone = item.dataset.phone;
        const statusText = item.querySelector("span:last-child");

        if (statusText) {
            if (onlineUsers.includes(phone)) {
                statusText.textContent = "Online";
                statusText.style.color = "green";
            } else {
                statusText.textContent = "Offline";
                statusText.style.color = "gray";
            }
        }
    });
});

socket.on("message history", (messages) => {
    chatMessages.innerHTML = "";

    messages.forEach((msg) => {
        const div = document.createElement("div");

        if (msg.type === "image") {
            const photo = document.createElement("img");
            photo.src = msg.message;
            photo.style.maxWidth = "220px";
            photo.style.maxHeight = "250px";
            photo.style.borderRadius = "12px";
            photo.style.display = "block";
            div.appendChild(photo);
        } else {
            const messageText = document.createElement("span");
            messageText.textContent = msg.message;
            div.appendChild(messageText);
        }

        if (msg.time) {
            const time = document.createElement("span");
            time.className = "chat-time";
            time.textContent = formatChatDate(msg.time);
            div.appendChild(time);
        }

        chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const imageInput = document.getElementById("imageInput");
const sendImageBtn = document.getElementById("sendImageBtn");
const chatMessages = document.getElementById("chatMessages");
const receiverPhone = document.getElementById("receiverPhone");

const openChatBtn = document.getElementById("openChatBtn");
const chatScreen = document.getElementById("chatScreen");

openChatBtn.addEventListener("click", () => {
  profileScreen.hidden = true;
  chatListScreen.hidden = false;

  const savedChats = JSON.parse(localStorage.getItem("shanuChats")) || [];

  savedChats.forEach((phone) => {
    addChatToList(phone);
  });
});

function joinPrivateRoom() {
  const receiver = receiverPhone.value.trim();
document.getElementById("friendName").textContent =
    "+91 " + receiver;
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

addChatToList(receiverFull);

  const members = [currentUser.phone, receiverFull].sort();
  activeRoom = members.join("_");

  socket.emit("join room", activeRoom);
  chatMessages.textContent = "Private room connected!";
}
const startChatBtn = document.getElementById("startChatBtn");

startChatBtn.addEventListener("click", () => {
  joinPrivateRoom();
receiverPhone.style.display = "none";
startChatBtn.style.display = "none";
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
sendImageBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image");
        imageInput.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5 MB");
        imageInput.value = "";
        return;
    }

    if (!activeRoom) {
        alert("First open a chat");
        imageInput.value = "";
        return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Upload failed");
        }

        socket.emit("private message", {
            roomId: activeRoom,
            message: result.imageUrl,
            type: "image",
            sender: currentUser.phone
        });

        imageInput.value = "";
        alert("Photo sent successfully!");
    } catch (error) {
        alert("Photo upload failed: " + error.message);
    }
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
});


function formatChatDate(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const msgDate = new Date(date);
  const time = msgDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  });

  if (msgDate >= today) return "Today, " + time;
  if (msgDate >= yesterday && msgDate < today) return "Yesterday, " + time;

  return msgDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short"
  }) + ", " + time;
}

socket.on("private message", (data) => {
    const msg = document.createElement("div");

    if (data.type === "image") {
        const photo = document.createElement("img");
        photo.src = data.message;
        photo.style.maxWidth = "220px";
        photo.style.maxHeight = "250px";
        photo.style.borderRadius = "12px";
        photo.style.display = "block";
        msg.appendChild(photo);
    } else {
        const messageText = document.createElement("span");
        messageText.textContent = data.message;
        msg.appendChild(messageText);
    }

    const date = data.time || new Date().toISOString();

    const time = document.createElement("span");
    time.className = "chat-time";
    time.textContent = formatChatDate(date);
    msg.appendChild(time);

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


function addChatToList(phone) {
    let savedChats = JSON.parse(localStorage.getItem("shanuChats")) || [];

    if (!savedChats.includes(phone)) {
        savedChats.push(phone);
        localStorage.setItem("shanuChats", JSON.stringify(savedChats));
    }
    const chatList = document.getElementById("chatList");

if (chatList.querySelector("p")) {
    chatList.innerHTML = "";
}

if ([...chatList.children].some(item => item.dataset.phone === phone)) {
    return;
}
    const item = document.createElement("div");
 item.dataset.phone = phone;
const phoneText = document.createElement("span");
phoneText.textContent = phone;

const statusText = document.createElement("span");
statusText.textContent = "Offline";
statusText.style.color = "gray";
statusText.style.marginLeft = "10px";

item.appendChild(phoneText);
item.appendChild(statusText);
    item.style.padding = "15px";
    item.style.borderBottom = "1px solid #ccc";
    item.style.cursor = "pointer";

    item.addEventListener("click", () => {
document.getElementById("receiverPhone").style.display = "none";
document.getElementById("startChatBtn").style.display = "none";
        chatListScreen.hidden = true;
        chatScreen.hidden = false;
        receiverPhone.value = phone.replace("+91", "");
        joinPrivateRoom();
    });

    chatList.appendChild(item);
}
const newChatBtn = document.getElementById("newChatBtn");
const newChatForm = document.getElementById("newChatForm");
const newFriendPhone = document.getElementById("newFriendPhone");
const createNewChatBtn = document.getElementById("createNewChatBtn");

newChatBtn.addEventListener("click", () => {
    newChatForm.hidden = false;
});

createNewChatBtn.addEventListener("click", () => {
    receiverPhone.value = newFriendPhone.value.trim();
    joinPrivateRoom();
});

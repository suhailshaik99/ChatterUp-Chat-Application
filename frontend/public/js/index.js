const socket = io.connect();

let onlineUsers = {};
let username, roomId, socketId, email, image;

const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementsByClassName("chat-box")[0];
const onlineUsersBox = document.getElementsByClassName("users-list")[0];
const notificationBox = document.getElementsByClassName("main-three")[0];
const typingIndicatorBox = document.getElementsByClassName("header-two")[0];

const p = document.createElement("p");
p.classList.add("typing-class");

sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message === "") {
    alert("Empty messages cannot be sent, make sure you have typed your message before sending it..");
    return;
  }
  socket.emit("group-chat", {
    username,
    roomId,
    message,
    socketId,
    email,
    image,
  });
  messageInput.value = "";
});

messageInput.addEventListener("input", () => {
  socket.emit("typing", { username, roomId });
});

socket.on("typingEvent", (typingData) => {
  p.value = "";
  p.textContent = `${typingData.username} is typing...`;
  typingIndicatorBox.appendChild(p);
  setTimeout(() => {
    p.textContent = "";
  }, 5000);
});

socket.on("user-info", (data) => {
  image = data.image;
  roomId = data.room_Id;
  email = data.user_email;
  socketId = data.socketId;
  username = data.user_name;
});

socket.on("chat-hist", (messages) => {
  messages.forEach((message) => {
    const datePara = document.createElement("p");
    const msgDiv = document.createElement("div");
    const profDiv = document.createElement("div");
    const imageElem = document.createElement("img");
    const messagePara = document.createElement("p");
    const usernamePara = document.createElement("p");
    const messageBox = document.createElement("div");
    msgDiv.classList.add("message-div");
    profDiv.classList.add("profile-div");
    messageBox.classList.add("message-box");
    datePara.classList.add("date");
    messagePara.classList.add("message");
    usernamePara.classList.add("username");
    imageElem.classList.add("user-profile");
    imageElem.src = message.profilePicture;
    datePara.textContent = message.shortTime;
    imageElem.alt = "user-profile-picture";
    messagePara.textContent = message.message;
    usernamePara.textContent = `~ ${message.username}`;

    if (email == message.email) {
      messageBox.classList.add("right-div");
      profDiv.classList.add("right-profile");
      usernamePara.classList.add("right-username");
      msgDiv.classList.add("message-color");
      profDiv.appendChild(imageElem);
      msgDiv.append(usernamePara, messagePara, datePara);
      messageBox.append(profDiv, msgDiv);
      chatBox.appendChild(messageBox);
    } else {
      profDiv.appendChild(imageElem);
      msgDiv.append(usernamePara, messagePara, datePara);
      messageBox.append(profDiv, msgDiv);
      chatBox.appendChild(messageBox);
    }
  });
});

socket.on("group-comm", (data) => {
  const datePara = document.createElement("p");
  const msgDiv = document.createElement("div");
  const profDiv = document.createElement("div");
  const imageElem = document.createElement("img");
  const messagePara = document.createElement("p");
  const usernamePara = document.createElement("p");
  const messageBox = document.createElement("div");
  msgDiv.classList.add("message-div");
  profDiv.classList.add("profile-div");
  messageBox.classList.add("message-box");
  datePara.classList.add("date");
  messagePara.classList.add("message");
  usernamePara.classList.add("username");
  imageElem.classList.add("user-profile");
  imageElem.src = data.image;
  datePara.textContent = data.date;
  imageElem.alt = "user-profile-picture";
  messagePara.textContent = data.message;
  usernamePara.textContent = `~ ${data.username}`;

  if (socketId == data.socket_Id) {
    messageBox.classList.add("right-div");
    profDiv.classList.add("right-profile");
    usernamePara.classList.add("right-username");
    msgDiv.classList.add("message-color");
    profDiv.appendChild(imageElem);
    msgDiv.append(usernamePara, messagePara, datePara);
    messageBox.append(profDiv, msgDiv);
    chatBox.appendChild(messageBox);
  } else {
    profDiv.appendChild(imageElem);
    msgDiv.append(usernamePara, messagePara, datePara);
    messageBox.append(profDiv, msgDiv);
    chatBox.appendChild(messageBox);
  }
});

socket.on("group-notifications", (notification) => {
  const notifyPara = document.createElement("p");
  const notificationDiv = document.createElement("div");
  notificationDiv.classList.add("notifications-div");
  notifyPara.textContent = notification;
  notificationDiv.appendChild(notifyPara);
  notificationBox.appendChild(notificationDiv);
});

socket.on("online-users-list", (usersList) => {
  onlineUsers = usersList;
  onlineUsersBox.innerHTML = "";
  for (const id in usersList) {
    const onlineUsersDiv = document.createElement("div");
    const userNamePara = document.createElement("p");
    const userNameSpan = document.createElement("span");
    const textNode = document.createTextNode(`${onlineUsers[id]}`);
    userNameSpan.classList.add("dot");
    userNamePara.classList.add("user-name-para");
    onlineUsersDiv.classList.add("online-users-div");
    userNamePara.appendChild(userNameSpan);
    userNamePara.appendChild(textNode);
    onlineUsersDiv.appendChild(userNamePara);
    onlineUsersBox.appendChild(onlineUsersDiv);
  }
});

socket.on("welcome", (message) => {
  const notificationDiv = document.createElement("div");
  const notificationMessage = document.createElement("p");
  notificationMessage.textContent = message;
  notificationDiv.classList.add("notifications-div");
  notificationDiv.appendChild(notificationMessage);
  notificationBox.appendChild(notificationDiv);
});

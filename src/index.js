import "./styles.css";

const h2 = document.querySelector("h2"),
  body = document.querySelector("body"),
  name = document.querySelector("#name"),
  form = document.querySelector("form"),
  clock = document.querySelector(".js-clock"),
  geo = document.querySelector(".js-geo"),
  nameBtn = document.querySelector("#nameBtn"),
  toDoList = document.querySelector("ul"),
  toDoInput = document.querySelector("#toDo"),
  images = ["images/a.jpg", "images/b.jpg"],
  toDos = [];

const USER_NAME = "name",
  TO_DOS = "toDos";

function initClock() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  clock.innerText = `${hours < 10 ? `0${hours}` : hours} : ${
    minutes < 10 ? `0${minutes}` : minutes
  } : ${seconds < 10 ? `0${seconds}` : seconds}`;
}

function init() {
  initBg();
  initName();

  initClock();
  setInterval(initClock, 1000);

  initGeo();

  initToDo();
}

function initGeo() {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      geo.innerText = `위도: ${position.coords.latitude} 경도: ${
        position.coords.longitude
      }`;
    },
    function() {
      geo.innerText = `Can't access geolocation`;
    }
  );
}

function initToDo() {
  const toDosTxt = localStorage.getItem(TO_DOS);
  if (toDosTxt !== null) {
    const toDos = JSON.parse(toDosTxt);
    toDos.forEach(function(toDo) {
      const li = document.createElement("li"),
        delBtn = document.createElement("button"),
        id = toDo.id,
        text = toDo.text;

      li.innerText = text;
      delBtn.innerText = "delete";
      li.appendChild(delBtn);
      toDoList.appendChild(li);

      const obj = {
        id: id,
        text: text
      };

      toDos.push(obj);

      delBtn.addEventListener("click", deleteToDos);
    });
  }
}

function initBg() {
  const image = new Image();
  image.src = images[Math.floor(Math.random() * 2)];
  image.classList.add("bgImage");
  body.appendChild(image);
}

function initName() {
  const name = localStorage.getItem(USER_NAME);
  if (name !== null) {
    h2.innerText = `${name}님 안녕하세요.`;
    form.remove();
  } else {
    h2.innerText = `이름을 입력하세요.`;
  }
}

function handlerNameBtn(e) {
  e.preventDefault();
  if (name.value.trim() === "") {
    alert("이름을 입력하세요.");
    name.value = "";
  } else {
    localStorage.setItem(USER_NAME, name.value);
    initName();
  }
}

function handlerInput(e) {
  if (e.keyCode === 13) {
    const li = document.createElement("li"),
      delBtn = document.createElement("button"),
      text = toDoInput.value;
    li.innerText = text;
    delBtn.innerText = "delete";
    li.appendChild(delBtn);
    toDoList.appendChild(li);

    const obj = {
      id: new Date().getTime(),
      text: text
    };

    toDos.push(obj);
    localStorage.setItem(TO_DOS, JSON.stringify(toDos));

    delBtn.addEventListener("click", deleteToDos);

    toDoInput.value = "";
  }
}

function deleteToDos(e) {
  const li = toDoList.querySelectorAll("li");
  let index = 0;
  li.forEach(function(o, i) {
    if (o === e.target.parentNode) {
      index = i;
      e.target.parentNode.remove();
    }
  });
  toDos.splice(index, 1);
  localStorage.setItem(TO_DOS, JSON.stringify(toDos));
}

name.addEventListener("submit", handlerNameBtn);
nameBtn.addEventListener("click", handlerNameBtn);
toDoInput.addEventListener("keydown", handlerInput);

init();

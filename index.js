//Getting the pokemon------------------------------

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

let level = document.getElementById("poke-length");
let baseLength = parseInt(level.options[level.selectedIndex].value);

let pokemons = [];

const analisePokemon = async () => {
  try {
    const { data, status } = await api.get("/pokemon?limit=1126");
    for (let i = 0; i < data.results.length; i++) {
      const element = data.results[i];
      if (element.name.length == baseLength) {
        pokemons.push(element.name);
      }
    }
    createSecretWord(pokemons);
  } catch (err) {
    console.error(err);
  }
};

let endGame = false;

const getImage = async () => {
  let cleanPokemon = secretWord.join("").toLowerCase();
  const winPokemon = document.querySelector(".winImg");
  const losePokemon = document.querySelector(".loseImg");

  try {
    console.log(cleanPokemon);
    const { data, status } = await api.get(`/pokemon-form/${cleanPokemon}`);
    const poke = await data.sprites.front_default;

    if (endGame === false) {
      losePokemon.src = poke;
    } else {
      winPokemon.src = poke;
    }

    console.log(poke);
  } catch (err) {
    console.error(err);
  }
};

//Wordle development

const keyboard = document.querySelector("#keyboard");
const keyboardLetters = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

const listElements = [];
let myAnswer = [];
let secretWord = [];
let positions = [];
let attempts = 0;
let rows = [];

const createSecretWord = (pokemons) => {
  let random = Math.floor(Math.random() * pokemons.length);
  secretWord = pokemons[random].toUpperCase().split("");
};

const createGrid = () => {
  for (let row = 0; row < 6; row++) {
    const list = document.createElement("ul");
    list.classList.add("grid-row");
    for (let column = 0; column < baseLength; column++) {
      const listItem = document.createElement("li");
      listItem.classList.add("row-item");
      listItem.id = `${row}-${column}`;
      list.appendChild(listItem);
    }
    rows.push(list);
  }

  grid.append(...rows);
};

keyboardLetters.map((letters) => {
  const list = document.createElement("ul");
  letters.map((letter) => {
    const listItem = document.createElement("li");
    switch (letter) {
      case "ENTER":
        listItem.innerHTML = `
        <button onclick="checkWord()" id="${letter}" class="key-btn">${letter}</button>
        `;
        break;
      case "DELETE":
        listItem.innerHTML = `
        <button onclick="deleteLetter()" id="${letter}" class="key-btn">${letter}</button>
        `;
        break;
      default:
        listItem.innerHTML = `
            <button onclick="pressLetter()" id="${letter}" class="key-btn">${letter}</button>
            `;
        break;
    }
    list.appendChild(listItem);
  });
  listElements.push(list);
});

keyboard.append(...listElements);

const windCondition = () => {
  if (myAnswer.join("") === secretWord.join("")) {
    endGame = true;
    getImage();
    disableBtn();
    openWinPopUp();
  }
};

const loseCondition = () => {
  if (myAnswer.join("") != secretWord.join("") && attempts === 6) {
    endGame = false;
    getImage();
    openLosePopUp();
  }
};

const checkWord = () => {
  windCondition();
  attempts += 1;
  loseCondition();

  if (myAnswer.length === baseLength) {
    for (let i = 0; i < baseLength; i++) {
      switch (true) {
        case myAnswer[i] === secretWord[i]:
          positions.push("green");
          let keyLetterG = document.getElementById(`${myAnswer[i]}`);
          keyLetterG.classList.add("green");
          keyLetterG.classList.remove("yellow");
          keyLetterG.classList.remove("gray");
          break;
        case secretWord.includes(myAnswer[i]):
          positions.push("yellow");
          let keyLetterY = document.getElementById(`${myAnswer[i]}`);
          keyLetterY.classList.add("yellow");
          break;
        default:
          positions.push("gray");
          let keyLetter = document.getElementById(`${myAnswer[i]}`);
          keyLetter.classList.add("gray");
          break;
      }
    }
    positions.map((color, id) => {
      const item = document.getElementById(`${attempts - 1}-${id}`);
      item.classList.add(color);
    });
    myAnswer = [];
    positions = [];
  } else {
    alert(`Not enough letters`);
  }
};

const deleteLetter = () => {
  if (myAnswer === 0) {
    alert("you got nothing");
  }
  const item = document.getElementById(`${attempts}-${myAnswer.length - 1}`);
  item.textContent = "";
  myAnswer.pop();
};

const pressLetter = () => {
  const button = event.target;
  if (myAnswer.length < baseLength) {
    const currentItem = document.getElementById(
      `${attempts}-${myAnswer.length}`
    );
    currentItem.textContent = button.textContent;
    myAnswer.push(button.id);
  } else {
    alert("Click Enter");
  }
};

const disableBtn = () => {
  let btn = document.querySelectorAll(".key-btn");
  for (let i = 0; i < btn.length; i++) {
    const element = btn[i];
    element.disabled = true;
  }
};

const enableBtn = () => {
  let btn = document.querySelectorAll(".key-btn");
  for (let i = 0; i < btn.length; i++) {
    const element = btn[i];
    element.disabled = false;
    element.classList.remove("green", "yellow", "gray");
  }
};

const reset = () => {
  for (let row = 0; row < 6; row++) {
    for (let column = 0; column < baseLength; column++) {
      const item = document.getElementById(`${row}-${column}`);
      item.textContent = "";
      item.classList.remove("green");
      item.classList.remove("yellow");
      item.classList.remove("gray");
    }
  }
  createSecretWord(pokemons);
  enableBtn();
  attempts = 0;
  myAnswer = [];
};

/*MODULES*/

const closeBtn = document.querySelector(".card-rules");
const openCardLength = document.querySelector(".card-length");
const closeBtn2 = document.getElementById("close-card-Rules");
const main = document.querySelector("main");

const closeFirst = () => {
  closeBtn.classList.add("inactive");
  openCardLength.classList.remove("inactive");
};

const rules = () => {
  closeBtn.classList.remove("inactive");
  closeBtn2.removeAttribute("onclick");
  closeBtn2.setAttribute("onclick", "closeRules()");
  main.classList.add("inactive");
};

const closeRules = () => {
  closeBtn.classList.add("inactive");
  main.classList.remove("inactive");
};

const setLevels = () => {
  event.preventDefault();
  pokemons = [];

  openCardLength.classList.add("inactive");
  main.classList.remove("inactive");

  let level = document.getElementById("poke-length");
  baseLength = parseInt(level.options[level.selectedIndex].value);

  createGrid();
  analisePokemon();
};

const changeLevel = () => {
  reset();

  rows = [];
  const uls = document.querySelectorAll(".grid-row");
  for (let i = 0; i < uls.length; i++) {
    const element = uls[i];
    element.remove();
  }

  main.classList.add("inactive");
  openCardLength.classList.remove("inactive");
};

/*POP- UPS------------------------------------------------------------------*/
const card = document.querySelector(".win-card");
const loseCard = document.querySelector(".loose-card");
const answerSpan = document.getElementById("answer");
const winSpan = document.getElementById("winnerAnswer");

const closeWinPopUp = () => {
  card.classList.add("close-PopUp");
  reset();
};

const closeLosePopUp = () => {
  loseCard.classList.add("close-PopUp");
  reset();
};

const openWinPopUp = () => {
  card.classList.remove("close-PopUp");
  card.classList.add("open-PopUp");
  winSpan.textContent = `${secretWord[0]}${secretWord
    .slice(1)
    .join("")
    .toLowerCase()}`;
};

let newAnswer = secretWord.join("");

const openLosePopUp = () => {
  loseCard.classList.remove("close-PopUp");
  loseCard.classList.add("open-PopUp");
  answerSpan.textContent = `The answer was ${secretWord[0]}${secretWord
    .slice(1)
    .join("")
    .toLowerCase()}`;
};

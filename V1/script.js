//DUMMY FACTS LIST
// const initialFacts = [
//   {
//     id: 1,
//     text: "React is being developed by Meta (formerly facebook)",
//     source: "https://opensource.fb.com/",
//     category: "technology",
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
//     source:
//       "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
//     category: "society",
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
//   {
//     id: 3,
//     text: "Lisbon is the capital of Portugal",
//     source: "https://en.wikipedia.org/wiki/Lisbon",
//     category: "society",
//     votesInteresting: 8,
//     votesMindblowing: 3,
//     votesFalse: 1,
//     createdIn: 2015,
//   },
// ];
import data from "./data";
console.log(initialFacts);

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

//SELECTIONS DOM ELEMENTS
let dataFatcts = "";
const btnShare = document.querySelector(".btn-share");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");
const catSelect = document.querySelectorAll(".category");
catSelect.forEach((el) => el.addEventListener("click", filterCategory));

//FILTER CAATEGORY
function filterCategory(e) {
  factsList.innerHTML = "";
  const filteredCategory = e.target.textContent.trim().toLowerCase();

  const filteredData = dataFatcts.filter(
    (fact) => fact.category === filteredCategory
  );

  if (filteredCategory == "all") createFactsList(dataFatcts);

  // console.log(filteredData);

  createFactsList(filteredData);
}

//Create Dom Elements: Render in factList
factsList.innerHTML = "";

//Load fact data from api
loadFacts();
async function loadFacts() {
  const res = await fetch(
    "https://aiwkusjjzolabsnzpxot.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpd2t1c2pqem9sYWJzbnpweG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4MDA1NTcsImV4cCI6MjAwMzM3NjU1N30.PscGQEtOKvFg3M2_N0N8jOfhpZ2K2vguy6pVhURFg68",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpd2t1c2pqem9sYWJzbnpweG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4MDA1NTcsImV4cCI6MjAwMzM3NjU1N30.PscGQEtOKvFg3M2_N0N8jOfhpZ2K2vguy6pVhURFg68",
      },
    }
  );

  dataFatcts = await res.json();
  // console.log(data);
  // createFactsList(dataFatcts);
  createFactsList(initialFacts);
}

function createFactsList(factsArray) {
  const htmlArr = factsArray.map(
    (fact) => `<li class="fact" key=${fact.id}>
  <p>
    ${fact.fact}
    <a
      class="source"
      href=${fact.source}
      target="_blank"
      >(source)</a
    >
  </p>
  <span class="tag" style="background-color: ${
    CATEGORIES.find((cat) => cat.name === fact.category).color
  }"
    >${fact.category}</span
  >
  <div class="vote-buttons">
    <button>👍 ${fact.voteInteresting}</button>
    <button>🤯 ${fact.voteMindblowing}</button>
    <button>⛔️ ${fact.voteFalse}</button>
  </div>
  </li>`
  );

  const html = htmlArr.join("");

  // console.log(htmlArr);
  factsList.insertAdjacentHTML("afterbegin", html);
}

//TOGGLE FORM VISIBILET
btnShare.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btnShare.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btnShare.textContent = "Share a Fact";
  }
});

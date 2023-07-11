import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

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

// const initialFacts = [
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
//   {
//     id: 4,
//     text: "Merhaba Eymen. Yazılım dünyasına hoş geldin",
//     source: "https://en.wikipedia.org/wiki/Lisbon",
//     category: "news",
//     votesInteresting: 20,
//     votesMindblowing: 0,
//     votesFalse: 0,
//     createdIn: 2023,
//   },
// ];

function Loader() {
  return <p className="message">Facts List is Loading.....</p>;
}

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facts, setFacts] = useState([]);
  const [filteredCat, setFilteredCat] = useState("all");

  useEffect(
    function () {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");

      if (filteredCat !== "all") query = query.eq("category", filteredCat);

      async function getFacts() {
        const { data: facts, error } = await query
          .order("created_at", { ascending: false })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert(error.message);
        setIsLoading(false);
      }
      getFacts();
    },
    [filteredCat]
  );
  return (
    <>
      <div className="container">
        <Header showForm={showForm} setShowForm={setShowForm} />
        {showForm ? (
          <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
        ) : null}

        <main className="main">
          <CategoryFilter setFilteredCat={setFilteredCat} />
          {isLoading ? (
            <Loader />
          ) : (
            <FactsList facts={facts} setFacts={setFacts} />
          )}
        </main>
      </div>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  function showFormHandler() {
    setShowForm((s) => !s);
  }
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I Learned" />
        <h1>Today I Learned</h1>
      </div>
      <button className="btn btn-large btn-share" onClick={showFormHandler}>
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

function NewFactForm({ setFacts, setShowForm }) {
  const [fact, setFact] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidUrl(source) || !fact || !category || fact.length > 200) return;

    // const newFact = {
    //   id: Math.round(Math.random() * 100000000),
    //   fact,
    //   source,
    //   category,
    //   votesInteresting: 0,
    //   votesMindblowing: 0,
    //   votesFalse: 0,
    //   createdIn: new Date().getFullYear(),
    // };

    setIsUploading(true);
    //Upload supabase
    const { data: newFact, error } = await supabase
      .from("facts")
      .insert([
        {
          fact: fact,
          source: source,
          category: category,
        },
      ])
      .select();
    if (error) alert(error.message);
    setIsUploading(false);

    if (error) setFacts((facts) => [newFact[0], ...facts]);
    //ses effekti
    setFact("");
    setCategory("");
    setSource("");

    setShowForm(false);
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={fact}
        onChange={(e) => setFact(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - fact.length}</span>
      <input
        type="text"
        placeholder="Thrustworthy spurce..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category:</option>
        {CATEGORIES.map((cat) => (
          <option value={cat.name} key={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setFilteredCat }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setFilteredCat("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li className="category" key={cat.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setFilteredCat(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactsList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        There is no fact in this category. Please add one ✌
      </p>
    );
  }
  return (
    <section>
      <ul>
        {facts.map((fact) => (
          <Fact fact={fact} key={fact.id} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the list</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.voteInteresting + fact.voteMindblowing < fact.voteFalse;

  async function handlerVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }
  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ DISPUTED]</span> : null}
        {fact.fact}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handlerVote("voteInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.voteInteresting}
        </button>
        <button
          onClick={() => handlerVote("voteMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.voteMindblowing}
        </button>
        <button onClick={() => handlerVote("voteFalse")} disabled={isUpdating}>
          ⛔️ {fact.voteFalse}
        </button>
      </div>
    </li>
  );
}

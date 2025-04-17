import React, { useEffect, useState } from "react";
import {
  getEntries, addEntry, updateEntry, deleteEntry, Entry
} from "./api";
import "./index.css";

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"" | "alphabetical">("");
  const [newWord, setNewWord] = useState("");
  const [newPages, setNewPages] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntries(search, sort);
      setEntries(data);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }

  useEffect(() => { refresh(); }, [search, sort]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const newEntry = await addEntry(
        newWord,
        newPages.split(",").map(v => parseInt(v)).filter(Number.isFinite)
      );
      setNewWord(""); setNewPages("");
      setEntries([newEntry, ...entries]);
    } catch (e) { setError((e as Error).message); }
  }

  async function handleUpdate(id: number) {
    const word = prompt("New word:");
    try {
      const updated = await updateEntry(id, word || undefined);
      setEntries(entries.map(e => (e.id === id ? updated : e)));
    } catch (e) { setError((e as Error).message); }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteEntry(id);
      setEntries(entries.filter(e => e.id !== id));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div style={{padding: 20, fontFamily:"sans-serif"}}>
      <h1>Book Index Entries</h1>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Word" value={newWord}
          onChange={e => setNewWord(e.target.value)} required
        />
        <input
          placeholder="Pages (comma-separated)" value={newPages}
          onChange={e => setNewPages(e.target.value)} required
        />
        <button type="submit">Add Entry</button>
      </form>

      <div style={{margin: "16px 0"}}>
        <input
          placeholder="Search" value={search}
          onChange={e => setSearch(e.target.value)}
        />&nbsp;
        <select value={sort}
          onChange={e => setSort(e.target.value as any)}
        >
          <option value="">No Sort</option>
          <option value="alphabetical">Sort: Alphabetical</option>
        </select>
      </div>

      {error && <div style={{color: "red"}}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Word</th>
              <th>Pages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.word}</td>
                <td>{e.pages.join(", ")}</td>
                <td>
                  <button onClick={() => handleUpdate(e.id)}>Edit</button>
                  <button onClick={() => handleDelete(e.id)}
                    style={{color:"red"}}
                  >X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

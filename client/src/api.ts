const API_BASE = "http://localhost:3000";

export type Entry = {
  id: number;
  word: string;
  pages: number[];
};

export async function getEntries(
  search = "", sort: "alphabetical" | "" = ""
): Promise<Entry[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  const res = await fetch(`${API_BASE}/entries?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch entries");
  return await res.json();
}

export async function getEntry(id: number): Promise<Entry> {
  const res = await fetch(`${API_BASE}/entries/${id}`);
  if (!res.ok) throw new Error("Entry not found");
  return await res.json();
}

export async function addEntry(word: string, pages: number[]): Promise<Entry> {
  const res = await fetch(`${API_BASE}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, pages })
  });
  if (!res.ok) throw new Error("Failed to add entry");
  return await res.json();
}

export async function updateEntry(
  id: number, word?: string, pages?: number[]
): Promise<Entry> {
  const body: Partial<Entry> = {};
  if (word !== undefined) body.word = word;
  if (pages !== undefined) body.pages = pages;
  const res = await fetch(`${API_BASE}/entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return await res.json();
}

export async function deleteEntry(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/entries/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete entry");
}

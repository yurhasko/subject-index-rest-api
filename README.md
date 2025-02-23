# Book Index REST API - TypeScript

This is a TypeScript REST API for managing a subject index with words and page numbers.
It allows you to search, add, update, delete entries, and sort them alphabetically.

## Prerequisites

- Node.js (v12+ recommended)
- PostgreSQL

## Setup

1. Clone (or create) the project and navigate to it:

```sh
mkdir book-index-app
cd book-index-app
```

2. Create the files as specified in the project structure.

Install dependencies:

```sh
npm install
```

3. Create a PostgreSQL database named `book_index` (or adjust per your .env).

Run the SQL script to create the table:

```sh
psql -U postgres -d book_index -f create_tables.sql
```

4. Create a `.env` file by copying `.env.example` (or provide via environment variables):

```sh
cp .env.example .env
```

5. Start the development server:

```sh
npm run dev
```

6. Or run in production mode:

```sh
npm start
```

The API will be available at http://localhost:3000.

## Bunch of `curl` commands to test the API

# 1. Create entry "apple"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "apple", "pages": [1, 5, 9]}'

# 2. Create entry "banana"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "banana", "pages": [2, 4, 6]}'

# 3. Create entry "cherry"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "cherry", "pages": [3, 7, 11]}'

# 4. Create entry "date"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "date", "pages": [4, 8, 12]}'

# 5. Create entry "elderberry"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "elderberry", "pages": [5, 10, 15]}'

# 6. Retrieve all entries
curl http://localhost:3000/entries

# 7. Retrieve entries filtering with search substring "an"
curl "http://localhost:3000/entries?search=an"

# 8. Retrieve entries sorted alphabetically
curl "http://localhost:3000/entries?sort=alphabetical"

# 9. Get a single entry by id (replace <APPLE_ID> with the actual id of "apple")
curl http://localhost:3000/entries/<APPLE_ID>

# 10. Update the "apple" entry: change word to "apricot" and update pages
curl -X PUT http://localhost:3000/entries/<APPLE_ID> \
  -H "Content-Type: application/json" \
  -d '{"word": "apricot", "pages": [1, 3, 5]}'

# 11. Delete the "banana" entry (replace <BANANA_ID> with its actual id)
curl -X DELETE http://localhost:3000/entries/<BANANA_ID>

# 12. Attempt to get the now-deleted "banana" entry (should return 404)
curl http://localhost:3000/entries/<BANANA_ID>

# 13. Create a new entry "fig"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "fig", "pages": [13, 17, 21]}'

# 14. Create another entry "grape"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "grape", "pages": [14, 18, 22]}'

# 15. Create an entry "honeydew"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "honeydew", "pages": [15, 19, 23]}'

# 16. Update the "fig" entry's pages (replace <FIG_ID> with actual id)
curl -X PUT http://localhost:3000/entries/<FIG_ID> \
  -H "Content-Type: application/json" \
  -d '{"pages": [2, 4, 6]}'

# 17. Delete the "cherry" entry (replace <CHERRY_ID> with actual id)
curl -X DELETE http://localhost:3000/entries/<CHERRY_ID>

# 18. Retrieve all entries after updates/deletions
curl http://localhost:3000/entries

# 19. Create another entry "kiwi"
curl -X POST http://localhost:3000/entries \
  -H "Content-Type: application/json" \
  -d '{"word": "kiwi", "pages": [16, 20, 24]}'

# 20. Update the "elderberry" entry by changing word to "elderflower"
#     (replace <ELDERBERRY_ID> with its actual id)
curl -X PUT http://localhost:3000/entries/<ELDERBERRY_ID> \
  -H "Content-Type: application/json" \
  -d '{"word": "elderflower"}'

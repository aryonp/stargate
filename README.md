# Stargate Dialer Web App

A simple web application that simulates the Stargate dialer interface. Users can select symbols to dial an address, which is then saved to a SQLite database along with a destination (if known). The app also includes a scraper to fetch known addresses and destinations from a Stargate wiki.

## Features

- Interactive glyph dialer interface (111 symbols)
- Save dialed addresses to SQLite database
- View dial history
- Scrape known addresses from Stargate wiki (stargate.fandom.com)
- Responsive design

## Project Structure

```
/stargate
  ├── server.js         # Express server with SQLite and scraping logic
  ├── package.json      # npm dependencies
  ├── public/
  │   ├── index.html    # Main HTML page
  │   ├── style.css     # Styling
  │   └── app.js        # Frontend logic
  └── stargate.db       # SQLite database (generated on first run)
```

## Installation

1.  Make sure you have [Node.js](https://nodejs.org/) installed (version 12 or higher).
2.  Navigate to the project directory:
    ```bash
    cd /home/aryonp/Documents/antigravity/stargate
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1.  Start the server:
    ```bash
    node server.js
    ```
2.  Open your web browser and go to `http://localhost:3000`.
3.  Click on the glyphs to select 7 symbols (the typical Stargate address length).
4.  Press the "DIAL" button to save the address.
5.  View your dial history below the dialer.
6.  (Optional) Visit `http://localhost:3000/api/scrape-addresses` to see scraped data from the Stargate wiki.

## Database

The application uses a SQLite database (`stargate.db`) to store:
- `symbols` table: Contains the 111 Stargate symbols.
- `dialed_addresses` table: Stores each dialed address, its destination (if known), and a timestamp.

## API Endpoints

- `GET /api/symbols` - Returns all symbols.
- `POST /api/dial` - Saves a dialed address. Expects JSON: `{ "address": "1-2-3-4-5-6" }`
- `GET /api/history` - Returns the dialed address history.
- `GET /api/scrape-addresses` - Scrapes known addresses from the Stargate wiki and returns them as JSON.

## Notes

- The scraper attempts to extract data from `https://stargate.fandom.com/wiki/List_of_stellar_addresses`.
- If the scraper fails or returns no data, it falls back to some sample data.
- The glyphs currently use placeholder symbols (numbers or simple shapes). In a real Stargate dialer, each glyph has a unique symbol. You can replace the `unicode` field in the `symbols` table with actual Stargate glyph unicode characters or images if desired.

## License

ISC
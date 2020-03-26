## node-toy-scrape

A very quick typescript file that runs some webscraping on https://www.bigbadtoystore.com/ using `jsdom` with pagination included.

Each page will be scrapped until nothing is returned.

The script accepts just one argument which is the search term itself. You can change behavior using the following environment variables:

```bash
# Renders debug statements to help you follow program execution. (optional, default is 0)
DEBUG=1

# Sets the page size for the request. BigBadToyStore only supports 20, 50 and 100 here. (optional, default is 20)
PAGE_SIZE=50

# Sets page limit for scraping. Useful for searches like "Marvel" that can return more than 200 pages. (optional, default is infinite)
PAGE_LIMIT=10
```

### Getting started

#### Requirements:

- Git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Node 12.x (https://nodejs.org/en/download/package-manager/)

#### Setup and running

```bash
# Clone script
git clone https://github.com/tmagalhaes1985/node-toy-scrape.git
cd ./node-toy-scrape

# Install dependencies
npm install

# Run search for Mezco with Debug enabled
DEBUG=1 npm start "Mezco"

# Run search and save results into a json file
npm --silent start "Mezco" > ./mezco-results.json

# Run search for Marvel with 20 as page size, 10 as page limit and debug enabled.
PAGE_SIZE=20 PAGE_LIMIT=10 DEBUG=1 npm start "Marvel"
```

Shortened example output for last command:

```
[DEBUG]: Running with PAGE_LIMIT=1.
[PAGE 1]: Fetching https://www.bigbadtoystore.com/Search?PageIndex=1&PageSize=5&SearchText=Marvel
[PAGE 1]: Got 20 results.
[
  {
    "name": "Spider-Man: Far From Home MAFEX No.125 Spider-Man (Stealth Suit)",
    "status": "Pre-Order",
    "company": "Medicom Toy",
    "price": "$94.99",
    "photo": "https://bbts1.azureedge.net/images/p/thumb/2020/02/fe1a87a2-0bf2-41cc-a81f-9286c3597784.png"
  },
  {
    "name": "Marvel One:12 Collective Thanos",
    "status": "Pre-Order",
    "company": "Mezco Toyz",
    "price": "$155.00",
    "photo": "https://bbts1.azureedge.net/images/p/thumb/2020/02/d508c668-e7da-42f0-815c-70ab9fb6e2b7.jpg"
  },
  {
    "name": "X-Men Marvel Legends Wave 4 Set of 7 Figures (Caliban BAF)",
    "status": "In Stock",
    "company": "Hasbro",
    "price": "$154.99",
    "photo": "https://bbts1.azureedge.net/images/p/thumb/2019/02/d056fad9-0c3e-48d8-9be2-269f4bebd4a4.jpg"
  },
  ... (more)
]
[DEBUG]: Done. Fetched 1 pages.
```


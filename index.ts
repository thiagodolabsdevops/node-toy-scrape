import fetch from "node-fetch"
import { JSDOM } from "jsdom"

type ScrapeResult = {
    name: any;
    status?: any;
    company: any;
    price: string;
    photo?: any;
}

const search = process.argv[2]
const pageLimit = Number(process.env.PAGE_LIMIT)
const pageSize = process.env.PAGE_SIZE
    ? Number(process.env.PAGE_SIZE)
    : 20

const hasPageLimit = !isNaN(pageLimit)
const hasDebug = process.env.DEBUG === "1"

const createUrl = (pageIndex: number) => {
    return `https://www.bigbadtoystore.com/Search?PageIndex=${pageIndex}&PageSize=${pageSize}&SearchText=${encodeURIComponent(search)}`
}

const fetchPageDocument = async (pageIndex: number) => {
    const url = createUrl(pageIndex);

    if (hasDebug) {
      console.log(`[PAGE ${pageIndex}]: Fetching ${url}`)
    }

    const payload = await fetch(url).then(res => res.text());
    const { document } = new JSDOM(payload).window;
    return document;
}

const getResult = (document: Document) => {
    const rows = document.querySelectorAll(".results-list > .row")
    return [...rows].map(scrape)
}

async function main() {
    if (hasPageLimit && hasDebug) {
      console.log(`[DEBUG]: Running with PAGE_LIMIT=${pageLimit}.`)
    }

    const aggregatedResult: ScrapeResult[] = []
    let currentPageIndex: number = 1

    while (true) {
        const currentDocument = await fetchPageDocument(currentPageIndex)
        const result = getResult(currentDocument)

        if (!result.length) {
            break;
        };

        if (process.env.DEBUG) {
            console.log(`[PAGE ${currentPageIndex}]: Got ${result.length} results.`)
        }

        aggregatedResult.push(...result)

        if (hasPageLimit && currentPageIndex === pageLimit) {
          break;
        }

        currentPageIndex++
   }

    console.log(JSON.stringify(aggregatedResult, null, 2))

    if (hasDebug) {
      console.log(`[DEBUG]: Done. Fetched ${currentPageIndex} pages.`)
    }
}

const elementNotFound = {
    getAttribute: () => undefined,
    textContent: undefined
}

const createSelector = (row: Element) =>
    (selector: string) =>
        (row.querySelector(selector) ?? elementNotFound)

const scrape = (row: Element): ScrapeResult => {
    const selector = createSelector(row)

    const name = selector(".product-name").textContent 
    const status = selector(".product-link-btn").getAttribute("alt")
    const company = selector(".product-companies").textContent
    const priceInteger = selector(".price-integer").textContent
    const priceDecimal = selector(".price-decimal").textContent
    const price = `${priceInteger}.${priceDecimal}`
    const photo = selector(".product-thumbnail").getAttribute("src")
    
    return {
        name,
        status,
        company,
        price,
        photo
    }
}

main()

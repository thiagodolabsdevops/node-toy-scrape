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

const createUrl = (pageIndex: number) => {
    return `https://www.bigbadtoystore.com/Search?PageIndex=${pageIndex}&PageSize=100&SearchText=${encodeURIComponent(search)}`
}

const fetchPageDocument = async (pageIndex: number) => {
    const payload = await fetch(createUrl(pageIndex)).then(res => res.text());
    const { document } = new JSDOM(payload).window;
    return document;
}

const getResult = (document: Document) => {
    const rows = document.querySelectorAll(".results-list > .row")
    return [...rows].map(scrape)
}

async function main() {
    let currentPageIndex: number = 1
    let aggregatedResult: ScrapeResult[] = []

    while (true) {
        const currentDocument = await fetchPageDocument(currentPageIndex)
        const result = getResult(currentDocument)

        if (!result.length) {
            break;
        };

        if (process.env.DEBUG) {
            console.log(`Got results for page: ${currentPageIndex}`)
        }

        aggregatedResult = [
            ...aggregatedResult,
            ...result
        ]

        currentPageIndex++
    }

    console.log(JSON.stringify(aggregatedResult, null, 2))
}

const elementNotFound = {
    getAttribute: () => undefined,
    textContent: undefined
}

const createSelector = (row: Element) =>
    (selector: string) =>
        (row.querySelector(selector) || elementNotFound)

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
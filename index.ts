import fetch from "node-fetch"
import { JSDOM } from "jsdom"

const search = process.argv[2]
// const url = `https://www.bigbadtoystore.com/Search?SearchText=${encodeURIComponent(search)}`
const url = `https://www.bigbadtoystore.com/Search?PageSize=100&SearchText=${encodeURIComponent(search)}`

async function main() {
    const payload = await fetch(url).then(res => res.text());
    const { document } = new JSDOM(payload).window;
    const rows = document.querySelectorAll(".results-list > .row")
    const result = [...rows].map(scrape)
    console.log(JSON.stringify(result, null, 2))
}

const scrape = (row:any) => {
    const name = row.querySelector(".product-name").textContent
    const status = row.querySelector(".product-link-btn").getAttribute("alt")
    const company = row.querySelector(".product-companies").textContent
    const priceInteger = row.querySelector(".price-integer").textContent
    const priceDecimal = row.querySelector(".price-decimal").textContent
    const price = `${priceInteger}.${priceDecimal}`
    const photo = row.querySelector(".product-thumbnail").getAttribute("src")
    
    return {
        name,
        status,
        company,
        price,
        photo
    }
}

main()
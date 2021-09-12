export interface AmazonData {

};

export const amazonUrls = [
  "https://amazon.",
  "http://amazon.",
  "https://www.amazon.",
  "http://www.amazon.",
  "https://amzn.",
  "http://amzn.",
  "https://www.amzn.",
  "http://www.amzn."
]

const getAmazonASIN = (url: string) => {
  const fullASINRegex = /(?:dp|o|gp|-|gp\/product|\/ASIN|gp\/offer-listing|gp\/product\/images|gp\/aw\/d)\/(B[0-9]{2}[0-9A-Z]{7}|[0-9]{9}(?:X|[0-9]))/g;
  const fullASINSearch = url.match(fullASINRegex);
  if ((fullASINSearch && fullASINSearch.length > 0) || url.startsWith("https://amzn.") || url.startsWith("http://amzn.") || url.startsWith("https://www.amzn.") || url.startsWith("http://www.amzn.")) {
    const ASINRegex = /(B[0-9]{2}[0-9A-Z]{7}|[0-9]{9}(?:X|[0-9]))/g;
    const ASINSearch = url.match(ASINRegex);
    if (ASINSearch && ASINSearch.length > 0) {
      return ASINSearch[0];
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export const getAmazonData = async (url: string) => {
  let amazonData: AmazonData = {};
  const ASIN = getAmazonASIN(url);
  if (ASIN) {
    console.log(ASIN);
    // TODO: Now use ASIN with amazon PAAPI SDK to find product data - title, description, image, pricing, etc.
    return amazonData;
  } else {
    return amazonData;
  }
}
import text from './animequotes'

interface animequote {
    quotenumber: number;
    quotesentence: string;
    quotecharacter: string;
    quoteanime: string;
}
export default function getAnimeQuote(): animequote {
    return text[Math.floor(Math.random() * text.length)];
}

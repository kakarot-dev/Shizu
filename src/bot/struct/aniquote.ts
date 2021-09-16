import text from './animequotes'

interface animequote {
    quotenumber: number;
    quotesentence: string;
    quotecharacter: string;
    quoteanime: string;
}
export default async function getAnimeQuote(): Promise<animequote> {
    return text[Math.floor(Math.random() * text.length)];
}

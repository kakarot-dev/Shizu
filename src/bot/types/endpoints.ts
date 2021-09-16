export type waifu = {
    id: number;
    slug: string;
    name: string;
    original_name: string | '';
    romanji_name: string | null;
    display_picture: string;
    description: string;
    weight: string | null;
    height: string | null;
    bust: string | null;
    hip: string | null;
    waist: string | null;
    origin: string | null;
    age: string | number | null;
    birthday_month: string | number | null;
    birthday_day: string | number | null;
    birthday_year: string | number | null;
    likes: number;
    trash: number;
    popularity_rank: number;
    like_rank: number;
    trash_rank: number;
    husbando: boolean;
    url: string;
}
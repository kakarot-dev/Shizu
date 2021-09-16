/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
import Anime from "./Anime";
import Manga from "./Manga";
import User from "./User";

class Kitsu {
  public _userAgent: string;
  public _options: {
    headers: { "User-Agent": string; Accept: string; "Content-Type": string };
  };
  constructor() {
    this._userAgent = "Shizu (https://github.com/aria-development/shizu)";
    this._options = {
      headers: {
        "User-Agent": this._userAgent,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    };
  }

  public async searchAnime(search: string, offset = 0): Promise<Anime> {
    return new Promise((resolve, reject) => {
      const searchTerm = encodeURIComponent(search);
      return axios
        .get(
          `https://kitsu.io/api/edge/anime?filter[text]="${searchTerm}"&page[offset]=${offset}`,
          this._options
        )
        .then((res) => res.data)
        .then((json) =>
          resolve(json.data.map((moreData) => new Anime(moreData)))
        )
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)));
    });
  }

  public async getAnime(id: string): Promise<Anime> {
    return new Promise((resolve, reject) =>
      axios
        .get(`https://kitsu.io/api/edge/anime/${id}`, this._options)
        .then((res) => res.data)
        .then((json) => resolve(new Anime(json.data)))
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)))
    );
  }

  public async searchManga(search: string, offset = 0): Promise<Manga> {
    return new Promise((resolve, reject) => {
      const searchTerm = encodeURIComponent(search);
      return axios
        .get(
          `https://kitsu.io/api/edge/manga?filter[text]="${searchTerm}"&page[offset]=${offset}`,
          this._options
        )
        .then((res) => res.data)
        .then((json) =>
          resolve(json.data.map((moreData) => new Manga(moreData)))
        )
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)));
    });
  }

  public async getManga(id: string): Promise<Manga> {
    return new Promise((resolve, reject) =>
      axios
        .get(`https://kitsu.io/api/edge/manga/${id}`, this._options)
        .then((res) => res.data)
        .then((json) => resolve(new Manga(json.data)))
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)))
    );
  }

  public async getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) =>
      axios
        .get(`https://kitsu.io/api/edge/users/${id}`, this._options)
        .then((res) => res.data)
        .then((json) => resolve(new User(json.data)))
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)))
    );
  }
}

export default Kitsu;

// Imports
/**
 * This is taken from (https://github.com/Moudoux/mcapi) so Please leave a star in the repo
 */
import axios from "axios";
// Variables
const api = "https://api.mojang.com/";
const sessionServer = "https://sessionserver.mojang.com/";

/**
 * Translates a UUID to the corresponding username
 * @param {String} uuid
 */
async function uuidToUsername(uuid: string): Promise<string> {
  const response = await axios.get(
    `${sessionServer}session/minecraft/profile/${uuid}`
  );
  return response.data.name;
}

/**
 * Translates a username to the corresponding UUID
 * @param {String} username
 */
async function usernameToUUID(username: string): Promise<string> {
  const response = await axios.get(
    `${api}users/profiles/minecraft/${username}`,
    {
      method: "GET",
    }
  );
  return response.data.id;
}

/**
 *
 * @param {Number} token
 */
async function oAuthToUUID(token: string): Promise<string> {
  const response = await axios.get(`https://mc-oauth.net/api/api?token`, {
    headers: {
      token: token,
    },
  });
  const json = await response.data;
  return json.status === "success" ? json.uuid : "fail";
}

export { uuidToUsername, usernameToUUID, oAuthToUUID };

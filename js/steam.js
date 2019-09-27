"use strict";

async function request_friend_list(id64, api_key) {
    return fetch(`https://api.steampowered.com/ISteamUser/GetFriendList/v0001?key=${api_key}&steamid=${id64}&relationship=all`).then(data => data.status == 200 ? data.json() : {friendslist: { friends: [] }});
}

async function request_user_data(id64s, api_key) {
  return fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002?key=${api_key}&steamids=${id64s}`)
    .then(data => data.json())
    .then(json => json.response.players);
}

async function request_ban_data(id64s, api_key) {
  return fetch(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1?key=${api_key}&steamids=${id64s}`)
    .then(data => data.json())
    .then(json => json.players);
}

async function request_steam_level(id64, api_key) {
  return fetch(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1?key=${api_key}&steamid=${id64}`)
    .then(data => data.json())
    .then(json => json.response.player_level);
}

async function request_previous_aliases(id64) {
  return fetch(`https://steamcommunity.com/profiles/${id64}/ajaxaliases`)
    .then(data => data.json())
    .then(json => json.map(player => player.newname));
}

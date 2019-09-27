"use strict";

async function to64bitID(customURL, api_key) {
    if (Boolean(customURL.match(/7656119\d{10}/))) {
        return customURL;
    }
    return fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?key=${api_key}&vanityurl=${customURL}`)
        .then(data => data.json())
        .then(json => json.response.steamid);
}

function toID2(id64, subst_one) {
    const sub = bigInt("0110000100000000", 16);
    const id = bigInt(id64);
    const X = Number(subst_one);
    const Y = id.mod(2);
    const Z = id.subtract(sub).divide(2);
    return `STEAM_${X}:${Y}:${Z}`;
}

function initializeListeners() {
    let subst_one = false;
    let api_key = undefined;
    chrome.storage.sync.get(["api_key", "subst_one"], storage => {
        if ('subst_one' in storage) {
            subst_one = storage.subst_one;
        }
        if ('api_key' in storage && storage.api_key !== "") {
            api_key = storage.api_key;
        }
    });

    chrome.runtime.onConnect.addListener(port => {
        if (port.name === "request-friend-data") {
            port.onMessage.addListener(async message => {
                const friends = await Promise.all(message.ids.map(id => to64bitID(id, api_key)));
                const friends_set = new Set(friends);
                const friends_data = await request_user_data(friends, api_key);
                const friends_bans = await request_ban_data(friends, api_key);
                //const id64 = await to64bitID(message.userid, api_key);
                //const user_data = await request_user_data([id64], api_key);
                //let aliases = await request_previous_aliases(id64);
                //aliases.push(user_data[0].personaname);

                let ban_map = new Object();
                for (const data of friends_bans) {
                    ban_map[data.SteamId] = data;
                }

                // associate and sort by bans
                for (let data of friends_data) {
                    data.relevance = 0.0;
                    if (data.steamid in ban_map) {
                        data.bans = ban_map[data.steamid];
                        if (data.bans.VACBanned || data.bans.CommunityBanned) {
                            data.relevance += 1.0;
                        }
                    }
                    data.id2 = toID2(data.steamid, subst_one);
                    //data.steam_level = await request_steam_level(data.steamid, api_key);
                    //data.relevance += Math.exp(-0.1 * (data.steam_level - 1.0));

                    //var prev_aliases = await request_previous_aliases(data.steamid);
                }
                friends_data.sort((a,b) => b.relevance - a.relevance);

                for (let data of friends_data) {
                    const two_ring = (await request_friend_list(data.steamid, api_key)).friendslist.friends.map(friend => friend.steamid);
                    const count_all = two_ring.length
                    if (count_all === 0) {
                        data.intersection = 0.0;
                    } else {
                        let count_isect = 0.0;
                        for (const friend of two_ring) {
                            if (friends_set.has(friend)) {
                                count_isect += 1.0;
                            }
                        }
                        data.intersection = count_isect / count_all;
                        data.relevance += 4.0 * data.intersection;
                    }
                    const level = await request_steam_level(data.steamid, api_key);
                    data.level = level;
                    port.postMessage(data);
                }
            });
        }

        if (port.name === "request-id2") {
            port.onMessage.addListener(async message => {
                const id64 = await to64bitID(message.id, api_key);
                const id2 = toID2(id64, subst_one);
                port.postMessage(id2);
            });
        }
    });

    chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.set({
            sb_url: "",
            api_key: "",
            subst_one: true
        });
    });
}

initializeListeners();

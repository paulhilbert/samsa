"use strict";

function getUserID(href) {
  href = href || location.href;
  const url = href.split("?")[0];
  const urlMatch = url.match(/(?:profiles|id|u)\/([^\/]+)/);
  const id = urlMatch[1];
  return id;
}

async function getSingleUserData() {
    const id = getUserID(location.href);
    const users = await new Promise(resolve => {
        const port = chrome.runtime.connect({name: "request-data"});
        port.postMessage({ids: [id]});
        port.onMessage.addListener(resolve);
    });
    return users[0];
}

async function init() {
    let sb_url = undefined;
    chrome.storage.sync.get(["sb_url"], storage => {
        if ('sb_url' in storage && storage.sb_url !== "") {
            sb_url = storage.sb_url;
            if (!sb_url.endsWith('/')) {
                sb_url += '/';
            }
        }
    });
    if (Boolean(document.querySelector(".playerAvatarAutoSizeInner"))) {
        const id = getUserID(location.href);
        const data = await new Promise(resolve => {
            const port = chrome.runtime.connect({name: "request-id2"});
            port.postMessage({id: id});
            port.onMessage.addListener(resolve);
        });
        const html_id2 = data.replace(/:/g, '%3A');
        var name_el = document.querySelector(".responsive_status_info");

        var id_node = document.createElement(sb_url !== undefined ? 'a' : 'span');
        id_node.innerHTML = data;
        id_node.classList.add("id2");
        if (sb_url !== undefined) {
            id_node.href = `${sb_url}index.php?p=banlist&searchText=${html_id2}&Submit=Search`;
        }
        name_el.appendChild(id_node)
    } else if (Boolean(document.querySelector(".friends_content"))) {
        const user_id = getUserID(location.href);
        for (var el of document.querySelectorAll(".state_block")) {
            el.style.display = 'none';
        }
        let friends = new Object();
        document.querySelectorAll(".persona").forEach(el => {
            el.setAttribute('data-relevance', 0);
            el.style.display = 'none';
            friends[el.getAttribute('data-steamid')] = el;
        });

        const req = new Promise(resolve => {
            const port = chrome.runtime.connect({name: "request-friend-data"});
            port.postMessage({userid: user_id, ids: Object.keys(friends) });
            port.onMessage.addListener((data) => {
                const id = data.steamid;
                let text_node = friends[id].querySelector('.friend_small_text');
                if (data.bans.CommunityBanned || data.bans.VACBanned) {
                    var node = document.createElement('span');
                    node.style.cssText = "color: red";
                    node.appendChild(document.createTextNode(`${data.bans.NumberOfVACBans} VACs, ${data.bans.NumberOfGameBans} GBs, Last: ${data.bans.DaysSinceLastBan} days`))
                    text_node.appendChild(node);
                    text_node.appendChild(document.createElement('br'));
                }
                if (data.relevance > 0.0) {
                    for (var el of document.querySelectorAll('.persona')) {
                        if (data.relevance > el.getAttribute('data-relevance')) {
                            el.parentNode.insertBefore(friends[id], el);
                            break;
                        }
                    }
                    friends[id].setAttribute('data-relevance', data.relevance);
                }
                friends[id].style.display = '';

                if (sb_url !== undefined) {
                    // add sourcebans link
                    var sb_link = document.createElement('a');
                    sb_link.classList.add("selectable_overlay_sb");
                    const html_id2 = data.id2.replace(/:/g, '%3A');
                    sb_link.href = `${sb_url}index.php?p=banlist&searchText=${html_id2}&Submit=Search`;
                    sb_link.style.zIndex = 2;
                    var link_el = friends[id].querySelector('.selectable_overlay');
                    link_el.style.right = "20px";
                    link_el.style.zIndex = 3;
                    link_el.parentElement.insertBefore(sb_link, link_el.nextSibling);
                    var sb_button = document.createElement('div');
                    sb_button.classList.add('sb_button');
                    var content_div = friends[id].querySelector('.friend_block_content');
                    content_div.parentElement.insertBefore(sb_button, content_div);
                }
            });
        });
    }
}


init();

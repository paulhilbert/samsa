"use strict";

function init() {
    chrome.storage.sync.get(["api_key", "sb_url", "subst_one"], storage => {
        const {api_key, sb_url, subst_one} = storage;
        const sburl_input = document.querySelector(".sburl-input");
        const apikey_input = document.querySelector(".apikey-input");
        const substone_input = document.querySelector(".substone-input");
        sburl_input.value = sb_url;
        apikey_input.value = api_key;
        substone_input.checked = subst_one;
    });

    const sburl_input = document.querySelector(".sburl-input");
    const apikey_input = document.querySelector(".apikey-input");
    const substone_input = document.querySelector(".substone-input");
    sburl_input.addEventListener("keypress", e => {
        if (e.key !== "Enter") {
          return;
        }

        chrome.storage.sync.set({sb_url: sburl_input.value});
    });
    apikey_input.addEventListener("keypress", e => {
        if (e.key !== "Enter") {
          return;
        }

        chrome.storage.sync.set({api_key: apikey_input.value});
    });
    substone_input.addEventListener("onClick", e => {
        chrome.storage.sync.set({subst_one: substone_input.checked});
    });
}

init();

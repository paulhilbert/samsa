# SAMSA Chrome Plugin

The *Sourceban Augmented Moderator Steam Addon* is a small plugin augmenting the Profile and Friend List views when browsing a user on Steam.
It is intended for Community Moderators/Admins frequently using Steam Profile pages to check the creditability of players.

On the profile page it simply adds the Steam-ID2 (in the right pane, under potentially listed VAC/Game Bans). In case a *SourceBan++* installation is
linked, the SteamID is a link allowing to directly search the SB database for this user.

The Friend List page now loads substantially slower due to a lot of background Steam API requests. The benefit however is that friends are now
sorted according to multiple queryable criteria. The idea is to make researching this profile's smurfs/mains and/or VAC banned friends easier.

Additionally in this view ban data is augmented for each user and a small orange area serves as a link to search the (optional) *SourceBans++* installation
for the corresponding user (similar to the main profile page).

## Installation

At the moment I do not intend to publish this Add-On as an official Chrome extension. In order to use this, pull it into any folder (or extract a downloaded tarball),
go to Extensions manager in Chrome, enable Developer mode (top right) and use "Load unpacked" to open the folder of the add-on. **Pro Tip:** *Read the entire source code
before adding extensions by random strangers*.

After installation, click on the Add-On button to open preferences, paste your Steam API key (yes, you need one) and optionally paste a link to your *SourceBans++* installation.

## Configuration

Apart from the SourceBans link and the Steam API key you have the option to automatically substitute the leading 0 in your Steam ID2 by a 1. While this flag usually signals
the community visibility state, some Source Bans installations need to be queried using always a 1. In general you should know whether or not you need this option.

## Note on Development

Querying the Steam API (especially things like the Community Level) takes quite some time. It is therefore a matter of balancing load time versus quality of friend list sorting and displayed
user data. Since I do not think that I found the sweet spot yet this balance might shift with future commits.

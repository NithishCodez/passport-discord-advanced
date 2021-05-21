**<h3>passport-discord-advanced</h3>**
<br>

**<h5>what is passport-discord-advanced?</h5>**
passport discord advanced is a Express middleware for discord OAuth2 and OAuth wrapper with essential functions to get you started with discord's OAuth applications

<br>

**Installation:**

```
npm i passport-discord-advanced
```

### **Basic Usage**

```js
const passport_discord = require("passport-discord-advanced");
const passport = new passport_discord({
  client_id: "Your client id",
  client_secret: "Your client secret",
  scopes: ["identify", "guilds.join" /*Any others*/],
  redirect_uri: "<Your url>/callback",
  token: "The bot token", //Optional
});
const express = require("express");
const app = express();

app.get("/", passport.authenticate());
app.get("/callback", async (req, res) => {
  const auth = await passport.authenticateUser(req);
  const user = await passport.getUserData(auth.access_token); //The authed user's data
  console.log(user);
});
```

### Add user to Guild

```js
await passport.joinUser({
  guild_id: "The guild id",
  access_token: "The access_token", //Pass The access token
});//return GuildMember Object
```

### Refresh Token

```js
const refreshed_object = await passport.refresh(auth.refresh_token);//return new object with access_token and refresh_token
```

### Contributors 📘

<a href="https://github.com/NithishCodez/passport-discord-advanced/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=NithishCodez/passport-discord-advanced" />
</a>

Made with ♥ and JavaScript By [NithishCodez](https://github.com/NithishCodez)
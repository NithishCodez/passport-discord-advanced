const passportDiscord = require("./class");
const passport = new passportDiscord({
  client_id: "",
  client_secret: "",
  scopes: ["identify", "guilds.join"],
  redirect_uri: "<url>/callback",
  token: "",
});
const app = require("express")();

app.get("/", passport.authenticate());

app.get("/callback", async (req, res) => {
  const auth = await passport.authenticateUser(req);
  const user = await passport.getUserData(auth.access_token);
  console.log(user);
  await passport.joinUser({
    guild_id: "837539733227569172",
    access_token: auth.access_token,
  });
  const refreshed_object = await passport.refresh(auth.refresh_token);
  console.log(refreshed_object);
});

app.listen(80);

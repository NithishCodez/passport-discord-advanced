class passport {
  constructor(obj) {
    if (typeof obj !== "object")
      throw new TypeError("Passport Discord: Costructor values must be object");
    const {
      client_id: id,
      client_secret: secret,
      scopes: scopes,
      redirect_uri: uri,
      token,
    } = obj;
    if (!id || !secret || !scopes || !uri)
      throw new Error(
        "Passport Discord: client_id || client_secret || scopes || redirect_uri Must be passed in the constructor"
      );

    /**
     * @type {String}
     *
     * The client id of the application
     */

    this.client_id = id;

    /**
     * @type {String}
     *
     * The client secret of the application
     */

    this.client_secret = secret;

    /**
     * @type {Array}
     *
     * Required scopes for oauth
     */

    this.scopes = scopes;

    /**
     * @type {String}
     *
     * The redirect link
     */

    this.redirect_uri = uri;

    /**
     * @type {String}
     *
     * The bot token
     */

    this.token = token;

    /**
     * @type {require("node-fetch")}
     *
     * Importing node-fetch Library
     */

    this.fetch = require("node-fetch");
  }

  /**
   * Makes the authorization url
   * @returns {String}
   */

  generateURL() {
    return encodeURI(
      "https://discord.com/api/oauth2/authorize?client_id=" +
        this.client_id +
        "&redirect_uri=" +
        this.redirect_uri +
        "&response_type=code&scope=" +
        this.scopes.join(" ")
    );
  }

  /**
   * The express middleware for authentication
   * @returns {Function}
   */

  authenticate() {
    var url = this.generateURL();
    var middleware = function (req, res, next) {
      res.redirect(url);
      next();
    };
    return middleware;
  }

  /**
   *
   * @param {Object} request
   * @returns {Object}
   */

  async authenticateUser(request) {
    const code = request.query.code;
    if (!code) throw new Error("Passport Discord: No Code found in callback");

    const data = new URLSearchParams({
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.redirect_uri,
      scope: this.scopes.join(" "),
    });

    const fetched = await this.fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    var result = await fetched.json();
    return result;
  }

  /**
   *
   * @param {String} access_token
   * @returns {Object}
   */

  async getUserData(access_token) {
    const fetched = await this.fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const json = await fetched.json();
    return json;
  }

  /**
   *
   * @param {Object} obj
   * @returns {Object}
   */

  async joinUser(obj) {
    if (!this.token)
      throw new Error(
        "Passport Discord: Bot token must be passed in the constructor for using joinUser function"
      );
    if (!obj)
      throw new Error(
        "Passport Discord: Obj must be passed in joinUser function"
      );
    if (typeof obj !== "object")
      throw new TypeError("Passport Discord: Obj must only be type of Object");
    var id = await this.getUserData(obj.access_token);
    id = id.id;
    const response = await this.fetch(
      `https://discord.com/api/guilds/${obj.guild_id}/members/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: obj.access_token,
        }),
      }
    );

    const json = await response.json();
    return json;
  }

  /**
   * 
   * @param {String} refresh_token 
   * @returns {Object}
   */

  async refresh(refresh_token) {
    const response = await this.fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.client_id,
        client_secret: this.client_secret,
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        redirect_uri: this.redirect_uri,
        scope: this.scopes.join(" "),
      }),
    });

    const json = await response.json();
    return json;
  }
}

module["exports"] = passport;

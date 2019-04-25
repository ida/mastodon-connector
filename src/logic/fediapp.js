const Masto = require('mastodon-api')
const getToken = require('./get_token').getToken

const onErr = (err) => { err = 'Error: ' + err + '\n'
  throw err
}

let fediAppsAmount = 0


function doWhenAccessTokenIsAvailable(app, doAfterAppIni) {
  app.params.password = null
  app.connectToApi()
  doAfterAppIni(app)
}


class FediApp {

  constructor(doAfterAppIni, ...params) {

    this.params = {
      access_token: null, // optional, if username and password are given
      api_url: null,      // optional, defaults to server + '/api/v1'
      client_name: null,  // optional, defaults to "FediApp Nr. + fediAppsAmount"
      client_id: null,
      client_secret: null,
      grant_type: 'password',
      password: null,     // optional, if access_token is given
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',  // dummy as described in docs.mastodon.social
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob', // same as redirect_uri, some libs want this name
      server: null,       // required
      scope: 'read write follow',  // default-value: assume we want it all
      scopes: 'read write follow', // same as scope, some libs want this name
      timeout_ms: 60*1000,
      username: null,     // optional, if access_token is given
    }
    this.ini(doAfterAppIni, ...params)
  }
  ini(doAfterAppIni, params) {

    fediAppsAmount += 1

    this.validateAndSetProps(params)

    if(this.params.access_token) {

      doWhenAccessTokenIsAvailable(this, doAfterAppIni)

      return
    }
    getToken(this.params).then(token => {

      this.params.access_token = token

      doWhenAccessTokenIsAvailable(this, doAfterAppIni)

		}).catch(err => onErr(err))
  }
  connectToApi() {
    this.apiConnection = new Masto(this.params)
  }
  listen(streamType, messageHandler) {
    let stream = this.apiConnection.stream('/streaming/' + streamType)
    stream.on('message', messageHandler)
  }
  send(message, visibility='direct', responseHandler=null) {
    this.apiConnection.post(
      '/statuses', {
        status: message,
        visibility: visibility
      }
    )
    .then(function(response) {
      if(responseHandler) responseHandler(response)
    })
    .catch(err => onErr(err))
  }
  validateAndSetProps(params) {
    // We need the server-address:
    let err = 'No property "server" given.'
    if( ! params.server) onErr(err)
    this.params.server = params.server
    // If there's no access_token, we need uname and pw:
    if( ! params.access_token) {
      let required = ['username', 'password']
      for(let i in required) {
        err = `No ${required[i]} given.`
        if( ! params[required[i]]) { onErr(err) }
        this.params[required[i]] = params[required[i]]
      }
    }
    // We got an access_token, save it in params:
    else {
      this.params.access_token = params.access_token
    }
    // If no client_name is given, set a default:
    if( ! params.client_name) {
      this.params.client_name = 'FediApp Nr. ' + fediAppsAmount
    }
    // Set api_url:
    this.params.api_url = this.params.server + '/api/v1'
  }
}



exports.FediApp = FediApp

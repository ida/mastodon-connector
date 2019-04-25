const axios = require('axios')

const onErr = (e) => { throw e.response.data }


function getAccessTokenByPassword(params) {

  // params must contain server, username, password
  let url = params.server + '/api/v1/apps'

  return axios.post(url, params).then(response => {

    params.client_id = response.data.client_id

    params.client_secret = response.data.client_secret

    url = params.server + '/oauth/token'

    // params must additionally contain grant_type and scope
    return axios.post(url, params).then(result => {

      return result.data.access_token

    }).catch(e => onErr(e))

  }).catch(e => onErr(e))

}


module.exports.getToken = getAccessTokenByPassword

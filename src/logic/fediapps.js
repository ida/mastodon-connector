const filesys = require('fs')
const FediApp = require('./fediapp').FediApp



class FediApps {
// Read data of passed path, initialize FediApps of it.
// If at least one app's data didn't have an access_token,
// write apps-data to path after all apps are initialized.
  constructor(dataPath, doWithAppAfterConnected=null, doWithAppsAfterConnected=null) {
    this.apps = []
    let data = JSON.parse(filesys.readFileSync(dataPath, 'utf8'))
    let haveAccessToken = true
    let initializedAppsAmount = 0

    for(let i in data) {

      if( ! data[i].access_token) {
        haveAccessToken = false
      }

      let doAfterAppIni = (app) => {

        initializedAppsAmount += 1

        data[i].access_token = app.params.access_token

        delete data[i].password

        if(doWithAppAfterConnected) doWithAppAfterConnected(app)

        // Is last app of data:
        if(initializedAppsAmount == data.length) {

          // Data changed:
          if(haveAccessToken === false) {

            filesys.writeFileSync(dataPath, JSON.stringify(data))
            console.log('Wrote changed data to "' + dataPath + '"')

          }
        }
      }
      this.apps.push(new FediApp(doAfterAppIni, data[i]))
    }
    if(doWithAppsAfterConnected) doWithAppsAfterConnected(this.apps)
  }
}


exports.FediApps = FediApps

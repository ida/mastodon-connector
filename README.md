mastodon-connector
==================


A wrapper for the Node.js-package "mastodon-api" to get started
quickly writing apps, which want to eat Fediverse-APIs.



What
----

1. Initialize API-consuming fediverse-apps from a config-file.

2. If no access_token is given, get it by passing a user's account-password,
   or use a dummy-string, if you want to use public API-methods.

3. Use mastodon-api to provide listen- and send-functions in an FediApp.

4. Write freshly obtained access_tokens to file and remove passwords.



Why
---

1. Fastest way to get started with developing FediApps.

2. Much less time-consuming than getting access_tokens via a webbrowser
   and traveling over several pages. No copy'n'pasting, no mouse harmed.

3. Take advantage of mastodon-api and provide some shortcut-wrappers.

4. Store access_tokens permanently for re-use and remove passwords for
   security reasons.


How
---

Provide a config-file in JSON-format with this structure:

    [
        {
            "server": "social.tchncs.de",
            "username": "you@example.org",
            "password": "yourSuperSecretPassword"
        }
      ,
        {
            "server": "social.nasqueron.de",
            "username": "you@example.org",
            "access_token": "092u37eg26bet2g2z2bv2tr1fwz2dkdu3zi7rd02i2jgslw9"
        }
      ,
        {
            "server": "social.example.com",
            "username": "anotherYou@example.org",
            "access_token": "arbitraryNonEmptyStringForUsingPublicApiFuncs"
        }
    ]


Then in one of your app's script, do:

    const FediApps = require('mastodon-connector').FediApps

    const callback = app => console.log('Ready to eat API of', app)

    const filepath = 'config.json'

    const fediapps = new FediApps(filepath, callback)



The callback-function is what you want to extend for further usage.
Here's an example using an app's listen-function:

    const msgHandler = msg => console.log(msg)

    const callback = app => app.listen('public', msgHandler)


You can pass another callback, executed after all apps were initiated:

    const afterAll = (apps) => {

      for(let i in apps) apps[i].send('A message send to all accounts')

    }

    new FediApps(filepath, callback, afterAll)



Author
======

Ida Ebkes, 2019.


License
=======

MIT, a copy is attached.


Contact
=======

For bug-reports, questions and everything, please add an issue in
the repository:

https://github.com/ida/fediapps/issues


Credits for merits
==================

Huge thanks go to:

- The "mastodon-api"-package for paving the way to stream-listening
  and sending posts, written by Eliah Winkler, a.k.a. "vanita5".

- The packages "mastodon-register-app" and "mastodon-get-token"
  written by Sandro Hawke, for giving guidance on how to obtain an
  access_token via password-authentication.

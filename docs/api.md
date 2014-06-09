
# API

##/api

### POST /login
Login

`@return` the auth token

Send it back through Authorized header for protected requests:
```
Authorized: ezseed+key
```

### GET /user/:uid <small>protected</small>
`@return` user informations, watched paths

### GET /path/:pid <small>protected</small>
`@return` path datas

### GET /:type/:item_id <small>protected</small>

`@return` json item where `type` one of:
- movies
- others
- albums

### PUT /:type/:item_id <small>protected</small>

Update item


### GET /:type/:item_id/:action

Where `action` one of:
- delete (protected)
- download
- read (stream)


## /admin

Those 'll need a root account

### POST /user/:uid/:action:

Where `action` one of (think useradd, usermod, userdel):
- add
- mod (path or password)
- del

### GET /config

`@return` configuration

### PUT /config

Update configuration
`@return` updated configuration

### POST|GET|PUT /plugins

### POST|GET|PUT /themes

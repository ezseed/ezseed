
# API

##/api

### POST /login
Login

`@return` the auth token

Send it back through Authorized header for protected requests:
```
Authorized: 'Bearer ' key
```

### GET /-/:uid <small>protected</small>
`@return` user informations

### GET /-/:uid/files <small>protected</small>
`@return` path datas

@todo missing params

### GET /-/:uid/size <small>protected</small>
`@return` user size

```
{
  total: { size: 1024, pretty: 1.0Mb },
  movies: {}
  others: {}
  albums: {}
}
```

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

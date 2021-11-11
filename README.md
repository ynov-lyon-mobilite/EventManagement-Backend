# Yvent API

## Oauth

### Facebook

**Client**

Change [CLIENT_ID]

à quoi sert le state ? aucune idée
redirect_uri = url du client du genre /auth/facebook/callback

```curl
https://www.facebook.com/v12.0/dialog/oauth?client_id=[CLIENT_ID]&redirect_uri=http://localhost:3000&state="{st=state123abc,ds=123456789}
```

**Server**

Change CLIENT_ID
Change SECRET_ID
Change CODE_TOKEN le token que le lient envoie au serveur
Change REDIRECT url du server ex /api/auth/facebook/callback

```curl
[POST]
https://graph.facebook.com/v12.0/oauth/access_token?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT]&client_secret=[SECRET_ID]&code=[CODE_TOKEN]
```

Change ACCESS_TOKEN from previous query

```curl
https://graph.facebook.com/me?access_token=[ACCESS_TOKEN]&fields=id,name,email,picture
```

### Google

**Client**

Change [CLIENT_ID]
redirect_uri = url du client du genre /auth/google/callback

```
https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.comauth/userinfo.email&include_granted_scopes=true&response_type=token&
redirect_uri=http://localhost:3000&client_id=[CLIENT_ID]
```

- Le client recupere le access_token sur l'url /auth/facebook/callback
- Le client recuperre le access_token puis l'envoie au server

**Server**
Le server appel l'url de google avec le token du client

```
https://www.googleapis.com/oauth2/v1/userinfo?alt=json
Bearer [TOKEN]
```

# Strapi plugin simple-strapi-auth

![](https://github.com/pdalvi1893/simple-auth)

Working on Strapi version: v4.*.*

## First Setup

1. Install as an npm dependency

```bash
# install dependencies
npm install simple-strapi-auth

```

2. Check the below api's to generate token and refresh token

```bash
# Access token generation CURL

curl --location 'http://localhost:1337/simple-auth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic bXlDbGllbnRJZDpteUNsaWVudFNlY3JldA==' \
--data-urlencode 'grant_type=client_credentials'

# Refresh Token generation Curl

curl --location 'http://localhost:1337/simple-auth/refresh-token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer b323177e47a266abc2d5d9cd42c08dcccdb9e365' \
--data-urlencode 'grant_type=refresh_token' \
--data-urlencode 'client_id=myClientId1' \
--data-urlencode 'client_secret=myClientSecret' \
--data-urlencode 'refresh_token=b323177e47a266abc2d5d9cd42c08dcccdb9e365'

# Static Builds API call

curl --location --globoff 'http://localhost:1337/api/countries' \
--header 'x-csrf-token: randomCSRFToken' \
--header 'Authorization: Bearer randomCSRFToken'


```

## Note

- Please replace appropriate token and Basic auth values to generate access token.
- For nextJS static builds, use x-csrf-token in header and same token to be sent in the authorisation header
  which will be generated using a secret key from .env file 

 ```
 X_CSRF_SECRET = "randomString"
 ```

## Features

- Currently only designed to prevent unauthorized access to strapi public apis
- Works entirely on the principle of OAuth Client Credentials.

## References

- [Component List - Strapi Helper Plugin](https://github.com/strapi/strapi/tree/master/packages/strapi-helper-plugin/lib/src/components)
- [Strapi Content Import Plugin](https://github.com/strapi/community-content/tree/master/tutorials/code/import-content-plugin-tutorial/plugins/import-content)
- [Guide to Strapi Content Import Plugin](https://strapi.io/blog/how-to-create-an-import-content-plugin-part-1-4?redirectPage=3)
- [Strapi Styled Component](https://design-system-git-develop-strapijs.vercel.app/)

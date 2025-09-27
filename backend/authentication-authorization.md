# Authentication and Authorization

1. Authentication answers the question, `who are you?` and Authorization answers the question, `What can you do?`

## Sessions, JWT and Cookies

1. HTTP is the backbone of client server communications. By default, HTTP is stateless means it treats every interaction as an isolated interaction
2. But there are some interactions like the user should remain logged in, in all the pages of the website, after logging in through the login page of the website. These marked the beginning of stateful interactions

### Sessions

1. Session make the request stateful. A session provides a way to establish temporary server side context for each user.
2. Steps:
   1. When a user login, the server creates a unique session id and stores it with the user info like user id in a persistent store like database or redis.
   2. The generated session id is sent to the client browser as a cookie
   3. All the further requests, that the client will make to the server, the client will include the cookie, with the session id, in the request
   4. Now, using the session id, the server will know the user id and through the user id, the server can fetch details like the things user has in its cart or it can fetch user data
   5. The sessions are short lived so if in some request, the user sends the expired session id, then server will either log out the user and ask him to login again or it will automitically create a new session id and sent it back to the client so the old session id gets replaced with new one
3. The session id enabled the web to have memory about the interactions

### JWT

1. As the web application grows into global distributed system, the stateful systems start causing bottleneck, because
   1. Memory
      1. Maintaining session data for millions of users become costly
   2. Replication
      1. in distributed architectures, synchronizing session data across servers or regions introduced latency and consistency challenges
2. JWTs offload state from the server while maintaining state, security and integrity
3. JWT is a stateless mechanism for transferring claims in a stateless manner between different two parties or systems
4. JWTs are self contained tokens. These tokens contain user data, like user id, role etc, and their cryptographic signatures in one token which is encoded.
5. JWT struct  
   ![JWT structure](./authentication-authorization/jwt-struct.png)
   1. The header specifies metadata about the JWT itself such as the signing algorithm for the JWT token
   2. Payload data is the data that the server stores in the JWT token like userid, user_role etc. The data is stored in JSON format
   3. Last part of JWT token is the signature which tells the server whether the token is tampered or not when the client sends the JWT token again in subsequent requests. The token is signed using a secret key which the server will keep on its side in some secrets manager. The secret key is used to encode or decode the token. If the JWT is tampered, then the server will not be able to decode it using the secret key
6. Thus, JWT can be used to verify users data in a stateless manner as the server does not have to store the session info any more.
7. After a user login, the server will generate a JWT token using the user data and encrypt it using the secret key and send it back to the client in a cookie. The clients browser will attach the JWT token cookie in subsequest requests and the server will decrypt the token and fetch the user info using the user id from the token
8. Advantages of JWT
   1. It saves a server side storage cost as server need not manage the state on its side
   2. Scalability as the request can go to any server in the distributed arch and the server will be able to decrypt the token using the secret key
   3. Portability as the JWT tokens can be passed between different systems
9. Challenges of JWT tokens
   1. Token Theft
      1. Since JWT was stateless if someone has access to your JWT, they can impersonate as you. There is no mechanism on server side to invalidate that token even if it is theft as the server is not maintaining the state and which ever request has a valid JWT token, the server will execute the request
      2. The only was is that the token expires or the server change its secret key. The changing of secret key will invalidate all the existing user JWT tokens which does not seem like a good idea.
   2. Revocation
      1. If the server wants to revoke some users access to the system, with JWT it is not possible as the server has to grant the permissions that are stored in JWT to the requesting client
10. Hybrid approcah can be used where the server maintains a JWT blacklist in a persistent storage. This can be used to block the user and their access but it makes the implementation somewhat stateful as server has to maintain this blacklist
11. Generally it is recommended to go with an auth provider, like Auth0, in production systems as it is there duty to maintain, invalidate tokens on their side

### Cookie

1. It is someway of storing a piece of info in user's browser from the server side
2. Using cookies, server stores some data/info in client's browser. This cookie feature is offered by browsers.
3. A cookie stored by a server/website will only be accessible to that server/website. No other website/server can access the cookies stored by other website.
4. Browsers also attach the cookies stored by a website while making subsquesnt requests to the website server by default
5. The server, after user login, sends the token or JWT token to be set in the client's browser in cookies and the browser will send the cookies set by the server in subsequent requests in request headers by default

## Types of Authentication

1. Stateful authentication
   1. Ideal for Web app based authentication
2. Stateless authentication
   1. Ideal for Mobile apps and Apis
3. API key
   1. ideal for machine to machine communication
4. OAuth2.0
   1. Ideal for 3rd party intergrations

### Stateful Authentication

1. Initially client sends email and password to the server. The server validates them and if they are correct, the server generates a session_id.
2. The server stores the session_id, user data like user_id and session expiry time in some persistent storage like any database or redis
3. The server also sends the session_id back to the client in response. The response will have `set-cookie` header which will set the session_id in the clients browser cookies. The cookie will be an HTTP only cookie that means JS cannot access the cookie, the browser will take care of it.
4. Now, all the subsequent requests that the client makes to the server, the browser will attach that session cookie in it.
5. The server will extract the session_id from the cookie and validates it along with its expiry time. If everything looks fine, the server will respond the clients request.
6. Pros:
   1. We have centralized control over all the sessions here. We will have info about all the active sessions of the users that we can extract from the persistent storage
   2. As we have the control, we can invalidate any session and revoke the user access any time because if a session_id's session is inactive, the user has to login back again to get the new session_id
   3. As this is a very secure method, most applications like Banking etc use the session based/stateful authentication as the in case of session id theft, that session_id can be invalidated anytime by the bank
7. Cons
   1. Limited scalability
   2. Higher operational complexity in case of distributed systems
   3. Latency issues

### Stateless Authentication

1. Initially client sends email and password to the server. The server validates them and if they are correct, the server generates a signed JWT token. The server will have a secret key which will help us in signing and verifying the JWTs
2. The JWT token will have the user's information, like user_id, token issue timestamp, user permissions etc, stored in it. The information is encrypted using the secret key
3. The JWT will be sent back to the client in the response. The server will not maintain the JWT info on its side. The token can be send in header but that's optional
4. The client need to send the JWT back in subsequent requests. Generally the tokens are sent under the `Authorization:<JWT>` header in requests
5. The server extracts the JWT token, decrypts it using the secret key and if it gets decrypted successfully then the server will extract the user info like user_id from the token itself.
6. Pros
   1. Can be easily used in distributed systems
   2. Ideal for mobile friendly applications where cookies are not present
7. Cons
   1. Token revocation is not possible so the token will remain active until it gets expired. Thus in case of token theft, nothing can be done
8. Thus, webapps can use stateful and mobile applications can use stateless authentication

### API key based authentication

1. You go a 3rd party platform like contentful CMS and generates API keys for your account
2. The API key can be used to gain access to the platform's backend server. The platform's backend server will expose some apis which our application can use to make changes or add data or retrieve data from the platform programatically by sending the generated api keys in request headers for validation/authentication
3. For example, we can use the api keys generated in contentful CMS to add blogs or retrieve some blog information
4. This is used when your server wants to communicate with a 3rd party server in permission based manner. Basically, these are important for machine to machine interaction

### OAuth 2.0 (OpenId Connect)

1. Suppose we visit multiple websites like Gmail, Netflix, Steam etc we have to login/create account in all the websites with different credentials
2. This approach has some issues:
   1. Security risk, reusing passwords is very common and incase of password theft, a lot of accounts can be compromised
   2. Fatigue, as users have to manage a lot of accounts and their passwords
3. This gave rise to a very important concept in OAuth i.e. Delegation.
4. One website started needing access to other websites for example, reminder application on your phone may need access to your gmail to scan and keep record of different events like holidays, flight bookings, movie bookings etc to remind you about the event on time, similary, a social media app like instagram, twitter etc wants to import your contacts from native contacts app or google contacts. These accesses are needed programmatically by the applications
5. Inorder for one application to get access to another platform, intially platforms started sharing the user passwords amound themselves which lead to issues like the other application will get full access of user's account and also there is no way to limit the access of resources. The user needs to change the password so that the other application's access can be revoked from an application. This problem is known as Delegation problem
6. OAuth

   1. Tokens are used here which provide limited access of one platform to the other like we can give access a readonly google contacts permission to another application. The application will only be able to read the google contacts and will not be able to perform any other operation in your google account
   2. Diagram:  
      ![OAuth](./authentication-authorization/OAuth.png)
      1. The different components are Client, Resource owner, Resource server and Auth server
      2. Resource owner is the user who owns the data i.e. you.
      3. Client is the application that is requesting access of your resource for example, Instagram is requesting access to your google contacts. Instagram is the client here
      4. Resource server is the server where your resources are stored for example Google server having your google account info
      5. Authorization server is the server that issues the token after authenticating the user.
      6. Resource server and Authorization server can hosted on the same server but companies like Googlw who has many apps like Google docs, photos etc prefer to have a centralized authorization server which provide access tokens for all their applications
   3. OAuth1.0 flow:
      1. Suppose you are using Instagram and it requires access to you google photos
      2. Instagram (client) will send a signed request to the google's request token api to get a temporary request token i.e `Client (Consumer) obtains a Request Token from the Service Provider (server).`
      3. Then, instagram redirects the user to authorizer server of google to login and approve the consent to give access to google photo i.e `The User is redirected to the Service Provider to authorize the Request Token.`
      4. After approval, the google will redirect the user back to instagram with a `verifier code` i.e `After authorization, the Service Provider redirects the User back to the Client with a verifier.`
      5. Now, Instagram will use both Request token and Verifier code to get the `Permanent access token` from google i.e `The Client exchanges the authorized Request Token + Verifier for an Access Token.`
      6. Now, all the subsequesnt request to google for photos will be signed using the permanent access token i.e.`The Client signs API requests with the Access Token + Consumer Secret to access protected resources.`
   4. Unlike OAuth 2.0, OAuth 1.0a uses cryptographic signatures and does not issue a Bearer token. Also, revoking access from the permanent access token is not easy so it would be catastrophic if the permanent access token is compromised
   5. OAuth 2.0:

      1. It introduced Bearer tokens
      2. It also allowed devs to choose flows based on the app type like the flow will be different for mobile apps and webapps
      3. Some of the flows are:
         1. Auth code flow, for server side apps
         2. Implicit flow, for browser based apps (discouraged due to security risks)
         3. Client credentials flow, for server to server communication without any human interactions
         4. Device code flow, in devices where we have limited input like smart TVs
      4. OAuth solved the issue of authorization not authentication so OIDC (Open ID Connect) is built on top of OAuth2.0 to fill the gap of authentication.
      5. OIDC extended OAuth2.0 by introducing ID token (JWT token)
      6. Steps:

         1. Suppose you are building an app `PhotoPrintApp` - a website that lets users print photos from their Google Drive
         2. So first, you need to register your app to Google api console by providing name of the app and a callback url like `http://photoprintapp.com/oauth/callback`. The callback url is the redirect uri where the tokens will be send by Google authenticator server
         3. The google api console will generate a client id and client secret for the photoprintapp that will be used by the app for future communications. These client id and secret can be considered as username and password
         4. Now, the user will initiate the integration flow between google drive and photoprintapp. The flow starts with the app getting redirected , with a request containing the client id of photo app, redirect uri/callback url, resposne type and the resource that the app needs access to. The request is to get an access token from the google's authorization server.

            ```
                GET https://accounts.google.com/o/oauth2/v2/auth
                ?client_id=1234567890-abcdef.apps.googleusercontent.com
                &redirect_uri=https://photoprintapp.com/oauth2/callback
                &response_type=code
                &scope=https://www.googleapis.com/auth/drive.readonly
                &state=xyz123

            ```

         5. The user will be presented with the scope where the user can change the level of access of google drive, he wants to give to the photo app
         6. Once the user specifies the scope, the google authorization server redirects the request to the photo app's callback url with a authorization code. The authorization code is ver short lived

            ```
                https://photoprintapp.com/oauth2/callback
                ?code=4/0AX4XfWjYpJxyzABC123
                &state=xyz123
            ```

         7. The photo app (client) will take the authorization code and send it again to the google's authorization server for an access token. The request contains the photo app's client id and secret as well

            ```
                POST /token HTTP/1.1
                Host: oauth2.googleapis.com
                Content-Type: application/x-www-form-urlencoded

                code=4/0AX4XfWjYpJxyzABC123
                &client_id=1234567890-abcdef.apps.googleusercontent.com
                &client_secret=shhh_its_a_secret
                &redirect_uri=https://photoprintapp.com/oauth2/callback
                &grant_type=authorization_code

            ```

         8. The google's authorization server will respond with access token along with its expiry time and a refresh token. Generally the access token are short lived, may be upto 1 hr, but the refresh tokens are long lived, ranging from 14 to 90 days. Once the access token is expired and the refresh token is valid, the photo app can again generate the access token directly from google's authorization server using the refresh token and need not go through the above whole flow of first generating the authorization token and then getting the access token. The access token type is `Bearer` that means any one with the token can get the access to resource.

            ```
                {
                    "access_token": "ya29.a0AfH6SMCfEXAMPLETOKEN",
                    "expires_in": 3599,
                    "refresh_token": "1//0gXrfreshTokenABC",
                    "scope": "https://www.googleapis.com/auth/drive.readonly",
                    "token_type": "Bearer"
                }

            ```

         9. After getting the acces token, photoprintapp can use the access token to access the resouces of the user/owner by calling the resource server, google drive's apis in our case. The access token will be used to authorize the requests from photo app to google drive

            ```
                GET /drive/v3/files HTTP/1.1
                Host: www.googleapis.com
                Authorization: Bearer ya29.a0AfH6SMCfEXAMPLETOKEN

            ```

      7. OAuth 2.0 flow with OIDC:
         1. Client Application redirects the User (End-User) to the Authorization Server / OpenID Provider with:
            1. response_type=code
            2. scope=openid profile email …
            3. client_id + redirect_uri
         2. Authorization Server authenticates the user and obtains consent.
         3. Authorization Server redirects back to the Client with an Authorization Code.
         4. Client exchanges the code (and its client secret) at the Token Endpoint for:
            1. Access Token (OAuth 2.0)
            2. ID Token (OIDC)
            3. optionally a Refresh Token
         5. Client validates the ID Token (signature, issuer, audience, nonce).
         6. Client uses the Access Token to access protected APIs; it uses the ID Token for authentication of the user.

## Authorization

1. Authorization refers to the giving specific permissions to the user so we can limit a user's capabilities on the platform
2. Like some users can be given read and write access to some notes application while others can get only read access
3. RBAC (Role Based Access Control) is one of the most famous authorization techniques used. A platform can have many role like Admin, User, Moderator etc and each role is assigned different set of permissions.
4. The users are assigned some role by the server after account creation based on the user's usecase
5. After user authentication, the server will check the role and permissions of the user based on the user info it gets after authentication
6. The server than passes the role and permissions to next set of api middlewares so it can be decided if the user has access to the api or not

### Error Messages

1. During the authentication process, the server might encounter some errors like wrong username or password or the user's account is locked due to many failed attempts
2. If we pass on the exact error messages to the user like `incorrect username`, `incorrect password` then it will be beneficial to the user but if there is a hacker trying to login on behalf of user then it will give some hints to the hacker
3. So better show generalized messages like `Incorrect username or password` or `Authentication failed` that does not give hints about what is wrong exactly

### Timming attacks

1. In Authentication, the user sends its username and password for login. Now, if the username is wrong and does not exist in DB then the generalized error message will be sent. If the username is correct, then the password is validated by first hashing it and then checking the hashed password in the DB against the username.
2. Clearly, the username validation takes less time than the password validation. So if the hacker entered wrong username then the error message will reach early as compared to if wrong password is entered.
3. Hacker might time the error response and know if the username could be wrong or the password
4. So, the authentication systems must introduce measures/delays to equalize the response times of whether the username is wrong or password

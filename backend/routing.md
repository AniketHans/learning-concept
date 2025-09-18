# Routing

1. HTTP methods tell about the intent of the action that we want to perform on the server like creating, fetching, updating, deleting etc on some resource
2. Routes, for example:`/api/books`, tell about the resource path where the intent action will be performed
3. Server combines both HTTP method and route like `GET /api/books`, which forms a unique pair and drives the request to a unique handler perfoming the intended actions on the desired resource

## Types of routes

1. Static routes
   1. These dont have any variable parameters inside the route. The route path is constant
   2. Eg: `GET /api/books`, `POST /api/books`, `GET /api/users`
2. Dynamic routes with path params
   1. These have a parameter in the route path
   2. The route path with dynamic param looks like `/api/users/:userid`. Here, userid is the variable and the response will differ based on different values of `userid`
   3. Eg: `GET /api/users/123`, `GET /api/users/456`
   4. Note: in path params, all the values are initially treated as strings. Like in above case altough the userid is 123 but it will be considered as string value and if you want you can convert the value to number in handler itself.
   5. The parameters that go directly after the `/` in the path are called as path parameters
3. Routes with query params
   1. We can have some query params, which are inserted in the route after a `?`.
   2. For example: `GET /api/search?query=whats+up&page=2`. Here, we have the route path as `/api/search` and the we have 2 query params here `query` and `page` with values `whats+up` and `2` respectively.
   3. We need to extract the query params in the handler as key value pairs. The keys of the query params, i.e `query` and `page`, are predefined in the api contract.
   4. Query params are generally used in case of GET apis for sending extra info to the handler to manipulate the response. GET apis use query params because ideally we dont send request body in a GET request
4. Nested Routes
   1. Here, we nest different types of resources.
   2. For example, `GET /api/users/123/posts/456`. Here, we are fetching 456 number post shared by user with id 123
5. Route versioning and deprecation
   1. We can have multiple versions of the same api returning different responses or different format of responses
   2. The routes might look like, for example: `GET /api/v1/users` and `GET /api/v2/users`
6. Catch all routes
   1. Client might be calling some routes which does not exist in our server. If you want to catch those and return some custom response then a `/*` route is added in the routes of the service

# gRPC

1. gRPC are open source Remote Procedural Calls system
2. This uses HTTP/2 as underlining transport mechanism and protobuf as message format

## Client Server Communication

1. We have the following protocols
   1. SOAP, REST, GraphQL --> Unidirectional
   2. SSE (Server Side Eventing), WebSockets --> Bidirectional
   3. Raw TCP
2. SOAP
   1. Simple Object Access Protocol
   2. It was almost like RPCs where client and server establishes communication and both of them has to have a library that understands SOAP i.e. XML, based on their language
   3. The client and server has to have an agreement on the request and response schema
3. REST
   1. REpresentational State Transfer
   2. It involves stateless communication and JSON.
   3. JSON has keys and values so there is no need to pre-agree on the structure of the data
4. SSE
   1. Here, server sends information to client
   2. It is not bidirectional
5. Raw TCP
   1. Some databases invented their own protocols based on raw TCP as it involves communication in binary and is bidirectional by default

### The problem with Client libraries

1. No matter what protocol you choose from above ones, the client sends communications and server receives it. client needs a client library like net/http in Golang, request in python etc for establishing and maintaining communication with the server
2. Any communication protocol needs client library for the language of choice
   1. SOAP library
   2. HTTP client library
3. If you are building a web application that will run on browser only then we dont need client library because browser becomes the client. The browsers are the biggest HTTP client library.
4. If the client is a browser, either you are making a fetch request or xhr using browser methods, the browser is maintaining the http communication with the server, it negotiates the protocol via ALPN (Application Layer Protocol Negotiation), it does the tls for us, it makes sure that the server supports HTTP/2 otherwise it automatically falls back to HTTP/1, it also does the streams etc. We only have to make our request using the HTTP method and browser takes care of it. That's why while writing frontend code, we dont have to import any HTTP client library, we just make use of fetch() and it does the job for us
5. When the client is not a browser, means the client could be our some backend service, that wanted to communicate with other service to fetch some data. We need a client library here for communicatig with other service.
6. Some examples of the client libaries are `request` library in python, `net/http` package in Golang. These are used to establish and maintain HTTP connection with some other service. The other service need not have this client libray installed as the client establishes the connection with the server and server uses the same connection to send the response back
7. These libraries are maintained by someone or some org. These libraries are expected to establish TLS and its negotiations and different HTTPs like HTTP/1.1, 2, 3.. etc. These libraries need a lot of maintainance and upradation to new tech.
8. It might be a case that you server application is upgraded to accept HTTP/2 connections but your client application's client library is not upgarded that frequently so you client application will not be able to leverage the benefits of latest tech. Or if there is any security bug in the client library and the owners are not updating it.
9. Websockets also need a client library for communication.
10. Also, each language can have multiple client libraries. Some are maintained and some are not. Making it hard to choose between things

## gRPC invention

1. gRPCs standardised the client libraries.
2. There will one client library for each popular languge.
3. Whoever maintains the gRPC project is going to build and maintain the client libraries for different libraries.
4. Since the communication is being done using protocol buffers and HTTP/2, so we need client and server to understand both
5. The protocol HTTP/2 is made hidden in the gRPC library so we need not worry about the HTTP/2 connection on our own. The gRPC client library will do it for us. Also, if in future, HTTP/3 become popular, the client libraries will be updated to HTTP/3 under the hood and still we need not worry about maintaining HTTP/3 on our side
6. Since gRPC uses protocol buffers so these are language nuetral. Both the server and client will have gRPC code generated from same proto files and data transfer between them will happen in binary format. We just have to serialize the data at client's end before sending and deserialize it at server's end after receiving.

### gRPC modes of communication

1. As gRPCs have a single library per language, it should be able to do what REST, websockets, SSE etc do with multiple client libraries
2. Four modes of communication
   1. Unary RPC
      1. It is the client server implementation. Client makes a request to the server and server responds with it syncronously
   2. Server Streaming RPC
      1. Here, client makes one request to the server and the server responds with a stream of responses. Eg video streaming
   3. Client Streaming RPC
      1. Here, client sends a stream of data to server. Eg uploading a huge file
   4. Bidirectional Streaming PRC
      1. Both client and server sends streams of data to each other eg chatting or gaming

### Pros of gRPC

1. Fast and compact
   1. gRPCs use protocol buffers which mainly use binary format to share data
   2. HTTP/2 also compresses the data while for transit
2. One client library
   1. One client library per language
   2. Any update to the library will be propogated to all the service written in that language
3. Progress Feedback (upload)
   1. You dont need to poll the server each time to know the status of your upload. Server automatically sends info using streams
4. Cancel request (HTTP/2)
   1. As gRPC uses HTTP/2, so you can actually cancel requests which was not possible in stateless protocols like HTTP/1.1
   2. gRPCs are stateful. When client makes a request, HTTP/2 tags each request with a stream Id. So to cancel the request, you can tag the same stream Id so that the server can hook on to the cancel request and cancel the request in a way written/coded by you
   3. The server will actually stops processing for that particular request. In HTTP/1.1, we actually stop waiting for the response when we cancel any request, the server is still processing the request
5. HTTP/2 and Protobuf benefits are with gRPCs

### Cons (Subjective)

1. Schema
   1. We have to have a predefined schema for communication
2. Thick client (need to check)
   1. may be compiling of the protofile happens each time we make a request through the client which is an expensive operation
3. Proxies
   1. Not every proxy understands gRPC.
4. Error handling
   1. Since it does not involve HTTP status codes so you have to maintain some standards of flagging the errors and also propogate same to the client
5. No native browser support
   1. Currently browsers does not support gRPC thats why gRPCs are ideal for server to server communications

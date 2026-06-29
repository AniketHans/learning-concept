# SSE

1. It is a pure HTTP thing with some headers.
2. It is one request with a very very long reponse
3. Need for SSE:
    1. Vanila request is not realtime
    2. Client wants real time updates or notifications from backend
4. What's a Server Sent Event:
    1. A response has start and end 
    2. Client sends a request
    3. Server sends logical events as part of the response. Server will not technically end the response but send multiple responses in chunks.
    4. Server never writes the end of the response
    5. It sends events that can be parsed
    6. It works on HTTP.
6. SSE Pros and Cons
    1. Pros
        1. Real time
        2. Compatible with the request response model
    2. Cons
        1. Client must be online
        2. Client might nt be able to handle the events thus polling is prefered for lighter clients
        3. HTTP/1.1 problem (6 connections) to the single domain. If all the connections are SSE connections, you cannot make request to the same domain. HTTP can have multiple streams in the same connection.
        

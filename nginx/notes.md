# Nginx Notes

### Introduction

1. Nginx is a web server that can also do important stuff like Load Balancing, Caching and Reverse Proxy.
2. Forward Proxy vs Reverse Proxy
   1. Generally, a client establishes an HTTP connection with our server. The server can be any one like nodejs, python etc.
   2. Forward Proxy:
      1. When client dont want to connect directly with the server, he/she might can use VPN
      2. The client connects to the VPN and then the VPN get connected to our server.
      3. Any request comming from client will be first go to VPN and then it is forwarded to the server as if the VPN client is requesting something from the server.
      4. The real identity of the client is hidden from the server as for server it is the VPN who is requesting on behalf of actual client.
      5. Also, multiple clients can connect to the VPN server and the VPN server will connect to different servers on behalf of those clients
      6. Here, VPN is acting a forward proxy server.  
         ![Forward Proxy](./resources/images/fwd-proxy.png)
   3. Reverse Proxy
      1. When we have multiple application servers and we create a server that is connected to these application servers.
      2. The client will not connect with these application servers directly. Instead, it will connect with this common server.
      3. The common server will reroute the client's request to any of the application server for executing the request.
      4. Here, the client does not know to which server his/her request will go to.
      5. In this case, the common server is acting as a reverse proxy.  
         ![Reverse proxy](./resources/images/rev-proxy.png)
      6. One of the most popular reverse proxy server is nginx
      7. We have to configure the Nginx server to behave in a particular manner we want.
3. Nginx act as a reverse proxy. It means clients connect to nginx server for request and nginx forwards this request to some application server connected to it and returns the result that we get from the application server.
4. Nginx can load balance the request comming from the user based on the configured algorithm.
5. Nginx can also do http caching of the response for some request. This will help the client getting faster response in case of same request being sent again.
6. So, our multiple clients will connect to the Nginx server and make a request. The Nginx server will decide at the run time to which application server the request should be routed, may be it is load balancing or routing based on request path, after that the response will be sent back first to the Nginx server and then it will be sent back to the requesting client.
7. Benefits of Nginx
   1. It can handle 10,000 concurrent requests
   2. It can cache Http requests
   3. Can act as Reverse proxy
   4. can act as a Load balancer
   5. can act as an api gateway, means rerouting the requests to a particular set of application servers based on the request path.
   6. Serve and cache static files like images, videos etc
   7. Handle SSL certificates

### Installing and working with nginx

1. Install the nginx using linux command `apt-get install nginx`
2. Now, the nginx by default works on port 80
3. Thus, after installing nginx on your machine itself, if you open browser and go to `localhost:80`, you will see the nginx default landing page.
4. If you want to know if a website is using nginx, then after landing on the website, go to the response headers of the website request, you will see the server info in it.
5. After installing the nginx, a folder with name nginx is created in the `etc` folder in linux.
6. In the nginx folder, we have a file named `nginx.conf`. This file contains the config of the nginx.
7. Here is the basic config for nginx

   ```
      events {

      }
      http {

         server {
               # The server is listening at port 80
               listen 80;
               # This will handle all the requests, we can give like www.example.com as well here
               server_name _;
               # It will serve the root path
               location / {
                     return 200 "Hello from nginx config file";
               }
         }
      }
   ```

8.

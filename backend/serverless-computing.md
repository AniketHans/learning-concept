# Serverless Computing

## Traditional Computing

1. Here, we have a dedicated server running continously our code
2. APIs are hosted on the server continously listening to requests. It is expected that the traffic will be continous
3. The server's resources are also chosen to handle high loads but the loads (no. of requests) are generally not high throughout the whole time so at times of low traffic, the server's resources are not utilized properly
4. Also, it is our duty generally to scale up and down the servers based on the traffic we are getting. Thus we have to maintain the things on our side

## Serverless Computing

1. Serverless computing is offered as IAAS (Infrastructure As A Service) that:
   1. can scale up and down as per the traffic
   2. is billed as per the code execution time
   3. is maintained by the cloud provider
   4. is fault tolerant
2. Serverless does not mean that the server is not required to execute the code. It means that we are not managing and sclaing the server. The cloud provider will do it for us. We just need to focus on writing the core business logic and the execution part, scaling the infra as per the demand etc is handled by cloud provider itself.
3. Cloud providers and their serverless offerings

   1. | Cloud Provider | Serverless offering        |
      | -------------- | -------------------------- |
      | AWS            | Lambda functions           |
      | GCP            | Google Cloud functions     |
      | Cloudfare      | Cloudfare workers          |
      | Azure          | Azure Serverless functions |

4. Advantages of Serverless
   1. No server management and maintainance
      1. In serverless arch, the servers, on which our code will run, are maintained and managed by cloud provider
   2. Pay as you go pricing
      1. We will be charged on the basis of the time it took to execute the code on serverless env.
      2. So ideal in case of inconsistent traffic
   3. No capacity planning
      1. The serverless automatically scales up
      2. Thus, provisioning is on-demand, precise and realtime. So engineers dont have to pre plan the caapcity for incoming traffic
5. Disadvantages of Serverless Computing
   1. Cold Start Problem
      1. Lets take example of AWS Lambda function. Because the function is not running constantly, in case of first request, the container, on which the lambda function will be executed, may need to boot up. Hence, the time to server the first request might be unnecessarily high.
      2. After the first request, the current running lamdba function will handle the other requests in less time as boot up is not needed.
      3. But if there is a large gap between 2 consequent requests and the current lambda function's execution env is destroyed then it needs to boot up again for the new request which came a long time after the previous request
   2. Not built for long running processes
      1. Serverless execution has a time limit (say 15 mins) which means we cannot deploy a logic that requires more than 15 mins for execution
   3. Testing and debugging is tough
      1. Replicating a serverless env in local is tricky and debugging is also tricky.
      2. Most of the times, the logs go to the logging service like `Cloudwatch` where debugging is somewhat difficult in case of large application
   4. Vendor Lock in
      1. It is hard to move from one cloud provider to another as we write the code so that it can be run on serverless offering of our cloud provider and if we have to move to another provider, we need to change our code
      2. Also, serverless arch uses the other services of cloud provider as well like lambda uses cloudwatch for logging. Thus, we configure the logs as per cloudwatch in our lambda function code. Hence moving to other provider will require code change for this as well
6. When to not use serverless
   1. Traffic load is almost constant and predictable
   2. Code has long running process and execution
   3. You need multi-tenancy. It is when each customer gets a separate infra
7. When to use serverless
   1. For quick build, prototype, test and deploy new applications
   2. Usecase is small and lightweight
   3. Traffic is bursty/inconsistent

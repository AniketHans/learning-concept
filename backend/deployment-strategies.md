# Deployment Startegies

## Canary Deployment

1. Canary deployment is a pattern that allows us to rollout code, features, changes to an initial users before we take it to 100% of the users
2. Suppose you have 7 servers in production and you have some new changes to be deployed. Instead of deploying the changes to all the 7 servers, you deploy it to 1 server. Some requests, say 5% of total requests, will be routed to the new code server and rest will be routed the other 6 servers. The monitoring of the new changes in production server should be done to make sure that the new changes can be released to all the servers and 100 % of the users
3. The flow will be :
   1. Deploy the new code to one server
   2. Monitor the vitals: RAM, CPU, Error rates
   3. Test the changes explicitly on the canary server
   4. If all good, rollout to the remaining servers
   5. If not, rollback or route the 100 % traffic to the old servers
4. How canary deployments are implemented?
   1. We create a small parallel infra and put a proxy or load balancer or api gateway at the front.  
      ![Canary deployments](./deployment-strategies/canary-deployment.png)
   2. The new code will be deployed to the new infra
   3. The proxy will route some of the traffic to the new infra and rest to the old infra
5. Pros of canary deployments
   1. It allows us to test the changes in production with real users
   2. Rollbacks are must faster
      1. As the new version of code is deployed on few machines, rolling back the changes will require us to only rollback those few machines and rerouting the traffic to old machines
   3. Limited blast radius
      1. If the new version of code has bugs, with canary deployment it will only affect very limited requests
   4. Zero downtime deployments
      1. As we gain more confidence, we can increase the rollout to more users.
      2. It means here, we have incremental rollout i.e. 1%, 5%, 10%, 20%, 50%, 100%, of the traffic to new code
   5. We can deploy even when we are unsure about the new release
   6. We can use canary deployment in A/B testing
      1. A/B testing is a method to compare two versions (A and B) of something—like a webpage or app feature—to see which performs better. Users are split into groups, each seeing one version, and results are measured (e.g., clicks or conversions) to decide which version works best.
6. Selection of users and servers can be more sophisticated
   1. Geographical
   2. User cohorts
   3. Random selection
   4. Beta users
   5. Sticky + random selection
   6. Internal employees
7. Cons of Canary deployments
   1. Engineers will habituated to test in production
   2. Architecting a canary deployment is complex
      1. We need extra components like LB, API gateway, separate scaling policy, instance/container launch config
   3. Parallel monitoring setup
      1. Observability is super important in canary setup so having a separate monitoring setup for both new and old version is mandatory to check the vitals like CPU, RAM etc

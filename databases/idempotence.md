# Idempotence in payment systems

## What is idempotence

1. It states that execute same operation multiple times, result is same as if the operation was applied just once
2. For example, in instagram, you can like a post by double tapping on the screen. No matter how many times you double tap on the screen on a post, only one like will be counted. This means there is some idempotency implemented on the like api of the instagram

## Idempotency in payments service

1. Suppose you have a payments service. Lets say user A wants to transfer 20,000$ to user B. Now, if due to some issues with the api call or retries or any bug, we dont want the payment to get processed twice or gets repeated.

### Why would the transaction repeat?

1. The transaction gets retried, either by user or service, in case of any failure
2. Lets take an example of api failure, lets say there are 2 services, payment_service and payment_gateway. payment_service gets a request from user A to transfer 20,000$ to user B. payment_service calls the payment_gateway service to process the trasaction. payment_gateway, after processing the request, sent a response but the response didn't reached the payment_service may be due to network failure or payment_service crashed. After everything is back on track again, the payment_service might retry the request as it did not get the previous response. This will lead to double payment thus making the opertaion non idempotent.

## Implementing Idempotence

1. We dont need idempotence if we dont retry automatically on the service side
   1. Depending on the product usecase, this might be the best approach
   2. If the operation failed, propogate the error and show it to the end user.
   3. Then, it will be the call from the end user, if he or she wants to retry or not.
   4. This prevents the blame to come on system if anything goes wrong.
2. Check and Update
   1. The system will retry only when it is sure that the first transaction definitely failed
   2. We need to create a unique payment_id and weave all the api calls with it.
   3. The payment_id can be used to check if the status of the payment and also retry if something goes wrong.
   4. Flow:
      1. Whenever a payment request comes to the payment_service, the payment_service talks to the payment_gateway and generates a payment_id
      2. The payment_id will be propogated to the end user and also will be kept on payment_service DB for record and further calls regarding that payment request. payment_gateway will also have the same payment_id as it is generated from it.
      3. payment_service will initiate the payment through the generated payment_id
      4. Now, if something breaks and payment_service reinitiates the same payment_request with same payment_id, the payment_gateway will first check the status of the payment on its side using the payment_id. If it is a success, it will send already done response to payment_service otherwise if it was a failure, payment_gateway will execute the payment again.

Thus, we first need an id to weave all the flows so that we can implement checks for idempotency

# Protobuf

## Issues with JSON

1. JSON data, shared amoung the request and response, is larger in size as compared to the data shared using protobuf
2. JSON data does not have a defined structure means suppose we have to getting employees data from the server which has properties name, salary and id. We might get the data in the following format
   ```JSON
    {
        "data":[
            {
                "name": "AS",
                "salary": 10000000,
                "id": 102,
            },
            {
                "name2": "AB",
                "id": 103,
            },
        ]
    }
   ```
   - Here you can see that `AS` gets the full user info but the other `AB` does not get the full info and also `name` key is changed for it. Although this is a valid JSON.

## Protobuf

1. Protocol buffers forces to have a structure and schema for the data being shared between the client and the server
2. This is language neutral means proto file can be used to generate code in any language
3. The proto file is just a schema definition about your messages and your structured data. It is our duty, based on the language of choice, to convert this proto file into code that implements the proto files objects
4. There is something called `protoc` which is a compiler build by Google where you feed the protofile and the language then it will create the code implemeting the objects of the proto file in the selected language
5. You can install the `protoc` compiler based on the OS you are using by the following link:
   [protoc compiler link](https://github.com/protocolbuffers/protobuf/releases)

### Pros and Cons of Protobuf

1. Pros:
   1. Protobufs have a schema. When schema is known, we can do some optimizations. We can store the data more efficiently when the schema is known
   2. It has small memory footprints since the data is serialized and deserialized into binary which is very compact in size. This makes data efficient to store and share over network
   3. Protobuf is language neutral. Using protoc, we can generate the code into any language
2. Cons
   1. The setup and writing code around it takes more time as compared to writing code that uses JSON for client server communication
   2. Since the code is generated using the protoc compiler, it might be possible that the generated code is buggy thus in case of bug fix to protoc by google, you first need to install the latest protoc compiler and then regenrate the code by again running all proto files in your code with protoc

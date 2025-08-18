# Handling Database Outages

## Reasons for database outages

1. In a typical setup, we have clients sending requests to our Application Load Balancer. There are mutiple servers behind the Load Balancer connected to it. All the servers are connected to the Database
2. In case of high demand, we can horizonatlly scale/increase the number of API servers but we can't generally scale a database server on demand as it is not operationally easy
3. As API servers are scaled but the database is not. This may lead to overload of queries to the database hence database will seem to not working properly
4. Meaning of Database is down:
   1. Queries taking too long to execute
      1. If lot of queries comes to the database for execution, database might take some time to execute those.
   2. API servers are not able to create new connections
      1. As with limited hardware, database can accept a certain number of connections in parallel. Thus it is important to close the connections after use by APIs
   3. Database server is continously crashing
      1. You might see the database is comming up but it is continously crashing
      2. Either some file is corrupted in the database file system or there is no disk space to store new data.
5. Note: You need to have very exhaustive monitoring on the database. By having exhaustive montioring on the database, you will be able to know the exact reason why the database is facing issues.

## Short term Solutions

1. These solution are meant to be performed quickly to minimize the database downtime at the time of crash
2. Connection maxed out:
   1. Due to hardware limitations, the number of active connections that the DB can handle is fixed.
   2. If all the connections are active, the API servers will not be able to create new connections
   3. Solutions
      1. Kill the queries that are running for long time
         1. Go inside the database and check queries that are not necessary and taking very long to executes and are holding the connections. You can also check for idle connections
         2. For you to connect to the database when all the connections are maxed out, you need `root` account.
         3. Root user is always given priority to connect to the DB.
         4. In most DBs, a particular set of DB connections are kept unused for the root user to login through them anytime irrespective of connection max out.
         5. Using root user, login to your DB and `SHOW PROCESSLIST` command can be used analys the connections
      2. Quickly scale the database
         1. If the connection max out is seen persistently, then you should vertically scale the database
         2. If you are using a managed service like AWS, you can easily scale the DB by increasing memory, CPU, number of connections etc.
         3. This scaling will lead to some downtime but it will solve the problem
      3. Always close the connection when the Job is done
         1. In code, after creating a connection and getting the resposne from DB, dont forget to close the connection
3. CPU operting at 100%
   1. Your database server CPU is maxed out
   2. In this case, although your database will accept the connections for queries but there are no CPU cycles to run those queries
   3. Solutions
      1. Kill the queries that are running for long time
      2. If it is due to recent deployments then revert the change
         1. You can check if any recent application deployment led to push of a very inefficient query
         2. The poor query may include mutiple joins, poor indexing etc, these will to engage a lot of CPU cycles for their execution
      3. Reboot the machine
      4. If this CPU 100% issue is persistent, scale up your database.

## Long term Solutions

1. These are done to ensure the DB should not go down again
2. Solutions:
   1. Ensure right set of indexes are in place
      1. It ensures queries are not scanning the whole database for results
      2. Best is monitor the queries and see if any table needs indexing on some column to speed up the query execution time
   2. Check the database configuration
      1. There are some bootup database configurations that can be tweeked to get better performance from the DB
      2. For example:
         1. innodb_cmp_per_index_enabled
            1. This compresses the indexes if enabled. You need to check of you need it or not. Since decompressing the index for queries will take time
         2. innodb_commit_concurrency
            1. This tells how many threads in parallel can commit changes onto the database
            2. You need to configure it using load testing on different values
         3. innodb_flush_log_at_txn_commit
            1. This tells when the commits be synced with the disk. The value can be 0, 1 and 2. These ensure there should be no delay, 1 sec and 2 sec delay after the changes are committed and finally written to the disk where the DB is stored.
            2. This value depends on the criticality of the database.
            3. O sec delay will write the commit to disk immediately but will also engage CPU cycles for disk I/O
            4. 1 sec or 2 sec will bundle the commits in intervals and then write them to DB in selected interval but there is chance of data loss if the machine crashes in between committing and writing that the disk
         4. innodb_lock_wait_timeout
            1. This tells how long transaction should be waiting for a lock, to get acquired and for writing the changes, before getting timeout
   3. Checking for notorious N+1 queries
      1. We generaly use ORMs to connect to the database
      2. Some ORMs trigger mutiple queries on the database to fetch the desired result even though you have written only one query in the ORM.
      3. You need to put logs on the ORM's query execution and check if the ORM is triggering more queries than the desired ones to get the result or not
   4. Upgrade DB version to newer ones
      1. Databases are not easy to upgrade frequently as newer versions may introduce some changes that may lead to changing schema of your older version
      2. Latest version are more performant as compared to older ones due to process improvements, bug resolutions etc
   5. Evaluate the need of horizontal scaling of database
      1. Read replicas
         1. This helps in handling more READ load.
         2. You can have multiple read replicas that can be used to perform reads and you can have one master DB for handling writes
      2. Sharding
         1. You can shard the data into mutiple partitions and then based on some hash value decide in which shard the newer data will be written
         2. This will help to scale data writes

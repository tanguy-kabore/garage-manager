C:\kafka> .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
C:\kafka> .\bin\windows\kafka-server-start.bat .\config\server.properties

C:\kafka> .\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --list
C:\kafka> .\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic maintenance-events --from-beginning
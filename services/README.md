Commandes utiles pour lancer zookeper et kafka
C:\kafka> .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
C:\kafka> .\bin\windows\kafka-server-start.bat .\config\server.properties

Commandes utiles pour manipuler les topics
C:\kafka> .\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --list
C:\kafka> .\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic maintenance-events --from-beginning
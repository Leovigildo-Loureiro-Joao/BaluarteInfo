export $(cat .env | xargs) && mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xms128m -Xmx256m"

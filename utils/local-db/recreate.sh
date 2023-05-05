docker kill splitsies-user-db-local

rm -rf utils/local-db/docker

cd utils/local-db

docker-compose -p splitsies-user-db up -d

aws dynamodb create-table \
    --table-name Splitsies-User-local \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --table-class STANDARD \
    --endpoint-url http://localhost:9000

docker kill splitsies-user-db-local
# Warehouse GraphQL Backend

Backend for product and warehouse management


## Requirements
1. `npm`
2. `docker`
3. `docker-compose`

## Architecture
The service stack includes:
* [express.js](https://expressjs.com/): NodeJS web framework
* [Apollo GraphQL](https://www.apollographql.com/): NodeJS GraphQL framework
* [prisma.js](https://www.prisma.io/): ORM manager framework for JS
* [PostgreSQL DB](https://www.postgresql.org/): The best relation database in town
  
## Usage

To set up and run the service on your local, run

`chmod +x run_local.sh && ./run_local.sh`

If everything worked, API should be reachable on [localhost](http://localhost:4000/graphql)
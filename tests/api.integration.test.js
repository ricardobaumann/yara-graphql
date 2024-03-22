const {ApolloServer} = require("apollo-server-express");
import { expect, vi, describe, it, beforeAll, beforeEach } from "vitest";
const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const gqlFiles = fs.readdirSync(path.join(__dirname, "../graphql/typedefs"));

let typeDefs = "";

gqlFiles.forEach((file) => {
    typeDefs += fs.readFileSync(
        path.join(__dirname, "../graphql/typedefs", file),
        {
            encoding: "utf-8"
        }
    );
});

const resolvers = require("../graphql/resolvers/index");

const testServer = new ApolloServer({
    typeDefs,
    resolvers,
});

const prisma = require("../db/prisma");

describe("API Integration testing", ()=> {

    beforeEach(async () => {
        await prisma.product.deleteMany();
        await prisma.product.create({
            data: {
                id: crypto.randomUUID().toString(),
                productName: "one",
                productType: "type1"
            }
        });
    })

    it("should return products",async ()=> {
        const response = await testServer.executeOperation({
            query: "query GetProducts { getProducts { productName productType } }"
        });
        expect(response.data).toEqual({
            getProducts: [{
                productName: "one",
                productType: "type1"
            }]
        });
    });

})
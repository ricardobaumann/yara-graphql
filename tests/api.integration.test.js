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
                productType: "STANDARD"
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
                productType: "STANDARD"
            }]
        });
    });

    it("should create a product", async () => {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: String!) {
                          createProduct(productName: $productName, productType: $productType) {
                                id
                                productName
                                productType
                            }
                    }`,
            variables: {
                productName: "foo",
                productType: "STANDARD"
            }
        });
        expect(response.data.createProduct.id).not.toBeNull();
        expect(response.data.createProduct.productName).toBe("foo");
        expect(response.data.createProduct.productType).toBe("STANDARD");
        expect(response.data.createProduct.productType).toBe("STANDARD");
    })

    it("should not allow duplicated products",async()=> {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: String!) {
                          createProduct(productName: $productName, productType: $productType) {
                                id
                                productName
                                productType
                            }
                    }`,
            variables: {
                productName: "one",
                productType: "STANDARD"
            }
        });
        expect(response.errors.length).toBe(1);
        expect(response.errors[0].message).toBe("DUPLICATED_PRODUCT");
    })

    it("should not allow empty product name",async()=> {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: String!) {
                          createProduct(productName: $productName, productType: $productType) {
                                id
                                productName
                                productType
                            }
                    }`,
            variables: {
                productName: " ",
                productType: "STANDARD"
            }
        });
        expect(response.errors.length).toBe(1);
        expect(response.errors[0].message).toBe("INVALID_PRODUCT_NAME");
    })

    it("should validate api input",async () => {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: String!) {
                          createProduct(productName: $productName, productType: $productType) {
                                id
                                productName
                                productType
                            }
                    }`,
            variables: {
                productName: "foo",
                productType: "whatever"
            }
        });
        expect(response.errors.length).toBe(1);
        expect(response.errors[0].message).toBe("INVALID_PRODUCT_TYPE");
    })

})
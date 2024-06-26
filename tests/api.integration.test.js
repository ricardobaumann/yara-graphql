const {ApolloServer} = require("apollo-server-express");
import { expect, describe, it, beforeEach } from "vitest";
const fs = require("fs");
const path = require("path");

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

    it("should create a valid product", async () => {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: ProductType!, $sizePerUnit: Int!) {
                          createProduct(productName: $productName, productType: $productType, sizePerUnit: $sizePerUnit) {
                                id
                                productName
                                productType
                                sizePerUnit
                            }
                    }`,
            variables: {
                productName: "foo",
                productType: "STANDARD",
                sizePerUnit: 10
            }
        });
        expect(response.data.createProduct.id).not.toBeNull();
        expect(response.data.createProduct.productName).toBe("foo");
        expect(response.data.createProduct.productType).toBe("STANDARD");
        expect(response.data.createProduct.sizePerUnit).toBe(10);
    });


    it("should not allow duplicated products",async()=> {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: ProductType!, $sizePerUnit: Int!) {
                          createProduct(productName: $productName, productType: $productType, sizePerUnit: $sizePerUnit) {
                                id
                                productName
                                productType
                                sizePerUnit
                            }
                    }`,
            variables: {
                productName: "one",
                productType: "STANDARD",
                sizePerUnit: 10
            }
        });
        expect(response.errors.length).toBe(1);
        expect(response.errors[0].message).toBe("DUPLICATED_PRODUCT");
    })

    it("should not allow empty product name",async()=> {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: ProductType!, $sizePerUnit: Int!) {
                          createProduct(productName: $productName, productType: $productType, sizePerUnit: $sizePerUnit) {
                                id
                                productName
                                productType
                                sizePerUnit
                            }
                    }`,
            variables: {
                productName: " ",
                productType: "STANDARD",
                sizePerUnit: 10
            }
        });
        expect(response.errors.length).toBe(1);
        expect(response.errors[0].message).toBe("INVALID_PRODUCT_NAME");
    })

    it("should validate product type",async () => {
        const response = await testServer.executeOperation({
            query: ` mutation CreateProduct($productName: String!, $productType: ProductType!, $sizePerUnit: Int!) {
                          createProduct(productName: $productName, productType: $productType, sizePerUnit: $sizePerUnit) {
                                id
                                productName
                                productType
                                sizePerUnit
                            }
                    }`,
            variables: {
                productName: "foo",
                productType: "whatever",
                sizePerUnit: 10
            }
        });
        expect(response.errors.length).toBe(1);
        expect(response.errors[0].message).toBe("Variable \"$productType\" got invalid value \"whatever\"; Value \"whatever\" does not exist in \"ProductType\" enum.");
    })

})
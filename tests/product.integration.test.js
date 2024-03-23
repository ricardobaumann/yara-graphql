import { expect, vi, describe, it, beforeAll, beforeEach } from "vitest";
import {ProductService} from "../service/product/index";
const prisma = require("../db/prisma");

const productService = new ProductService(prisma);

describe("Product Integration Testing", ()=>{

    beforeEach(async()=> {
        await prisma.product.deleteMany();

        await prisma.product.create({
            data: {
                id: crypto.randomUUID().toString(),
                productName: "one",
                productType: "STANDARD"
            }
        });
    })

    it("should create a product",async ()=> {
        return await productService.addProduct("foo", "STANDARD")
            .then(value => {
                expect(value.productName).toBe("foo");
                expect(value.productType).toBe("STANDARD");
                expect(value.id).toBeDefined;
            })
    })

    it("should now allow duplicated product", async()=> {
        expect(()=> productService.addProduct("one", "HAZARDOUS"))
            .rejects
            .toThrowError("DUPLICATED_PRODUCT");
    })

    it.each([
        "",
        " ",
        null,
        undefined
    ])('should validate product name', async (productName) => {
        expect(()=> productService.addProduct(productName, "HAZARDOUS"))
            .rejects
            .toThrowError("INVALID_PRODUCT_NAME");
    })

    it.each([
        "",
        " ",
        null,
        "whatever",
        undefined
    ])('should validate product type', async (productType) => {
        expect(()=> productService.addProduct("new", productType))
            .rejects
            .toThrowError("INVALID_PRODUCT_TYPE");
    })

    it("should list products", async () => {
        return await productService.getProducts()
            .then(value => {
                expect(value.length).toBe(1);
                expect(value[0].id).toBeDefined;
                expect(value[0].productName).toBe("one");
                expect(value[0].productType).toBe("STANDARD");
            })
    })

})


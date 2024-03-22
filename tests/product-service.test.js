import { expect, vi, describe, it, beforeAll } from "vitest";
import prisma from '../db/__mocks__/prisma'
vi.mock('../db/prisma')
import {ProductService} from "../service/product/index";

describe("Product Service", ()=> {
    let productService;

    beforeAll(()=> {
        productService = new ProductService(prisma);
    })

    it("should map input and create products",async() => {
        const newProduct = {
            productName: "foo",
            productType: "bar",
            id: crypto.randomUUID().toString()
        };
        prisma.product.create.mockResolvedValue({...newProduct});
        const product = await productService.addProduct(newProduct.productName, newProduct.productType);
        expect(product).toStrictEqual({ ...newProduct })
        const data = prisma.product.create.mock.calls[0][0].data;
        expect(data.productName).toBe("foo");
        expect(data.productType).toBe("bar");
        expect(data.id).toBeDefined;
    })

    it("should throw error on duplicated product", async ()=> {
        prisma.product.create.mockRejectedValue(new Error("Unique constraint failed on the fields: (`productName`)"));
        await expect(productService.addProduct("foo", "bar"))
            .rejects
            .toThrowError("DUPLICATED_PRODUCT");
    })

    it("should list products",async () => {
        const products = [
            {
                productName: "foo",
                productType: "bar",
                id: crypto.randomUUID().toString()
            }
        ]

        prisma.product.findMany.mockResolvedValue(products);

        const result = await productService.getProducts();

        expect(result).toBe(products);
    })


})
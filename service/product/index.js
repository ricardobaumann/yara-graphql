const {handleError} = require("../../error-handlers/index")


class ProductService {
    static productTypes = ["STANDARD", "HAZARDOUS"];
    constructor(prisma) {
        this.prisma = prisma;
    }

    validate(productName, productType) {
        if (!(productName === null || productName === undefined || productName.trim().length === 0)) {
            if (!(productType === null || !ProductService.productTypes.includes(productType))) {
            } else {
                throw new Error("INVALID_PRODUCT_TYPE");
            }
        } else {
            throw new Error("INVALID_PRODUCT_NAME");
        }
    }

    async addProduct (productName, productType)  {
        this.validate(productName, productType);
        return this.prisma.product.create({
            data: {
                id: crypto.randomUUID().toString(),
                productName: productName,
                productType: productType
            }
        }).catch(handleError);
    }

    async getProducts()  {
        return this.prisma.product.findMany();
    }

}

module.exports = {ProductService}
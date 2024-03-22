const {handleError} = require("../../error-handlers/index")

class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addProduct (productName, productType)  {
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
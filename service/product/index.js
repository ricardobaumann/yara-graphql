
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
        });
    }

    async getProducts()  {
        return this.prisma.product.findMany();
    }

}

module.exports = {ProductService}
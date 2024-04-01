const {handleError} = require("../../error-handlers/index")

/**
 * Service for product business logic and operations
 */
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

    /**
     * Add a product with given parameters
     * @param productName
     * @param productType
     * @param sizePerUnit
     * @returns {Promise<Promise<GetResult<Prisma.$ProductPayload<DefaultArgs>, {data: {sizePerUnit, id: string, productName, productType}}, "create">> & {}>}
     */
    async addProduct (productName, productType, sizePerUnit)  {
        this.validate(productName, productType);
        return this.prisma.product.create({
            data: {
                id: crypto.randomUUID().toString(),
                productName: productName,
                productType: productType,
                sizePerUnit: sizePerUnit
            }
        }).catch(handleError);
    }

    /**
     * Return the product list
     * @returns {PrismaPromise<GetFindResult<Prisma.$ProductPayload<DefaultArgs>, Prisma.ProductFindManyArgs<DefaultArgs>>[]>}
     */
    async getProducts()  {
        return this.prisma.product.findMany();
    }

}

module.exports = {ProductService}
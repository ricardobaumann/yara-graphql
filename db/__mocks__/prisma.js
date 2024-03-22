const {PrismaClient} = require("@prisma/client");
import { expect, test, vi, describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import { mockDeep, mockReset } from 'vitest-mock-extended'

beforeEach(() => {
    mockReset(prisma)
})

const prisma = mockDeep();

module.exports = prisma;
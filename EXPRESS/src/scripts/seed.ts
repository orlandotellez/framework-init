import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin", description: "Full access to the system" },
  })

  const staffRole = await prisma.role.upsert({
    where: { name: "staff" },
    update: {},
    create: { name: "staff", description: "Can manage products, services and inventory" },
  })

  const adminPasswordHash = await bcrypt.hash("admin123", SALT_ROUNDS)
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password_hash: adminPasswordHash,
      role_id: adminRole.id,
    },
  })

  const staffPasswordHash = await bcrypt.hash("staff123", SALT_ROUNDS)
  await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      name: "Staff",
      email: "staff@example.com",
      password_hash: staffPasswordHash,
      role_id: staffRole.id,
    },
  })

  const products = [
    { name: "Coca-Cola 500ml", barcode: "7790000000011", price: 1.5, cost: 1.1, stock: 50, low_stock_threshold: 10 },
    { name: "Papas Lays 125g", barcode: "7790000000028", price: 2.0, cost: 1.4, stock: 30, low_stock_threshold: 10 },
    { name: "Agua mineral 600ml", barcode: "7790000000035", price: 0.8, cost: 0.4, stock: 8, low_stock_threshold: 10 },
    { name: "Chocolate 70g", price: 1.2, cost: 0.9, stock: 20, low_stock_threshold: 5 },
  ]

  for (const product of products) {
    if (product.barcode) {
      await prisma.product.upsert({
        where: { barcode: product.barcode },
        update: {},
        create: product,
      })
    } else {
      await prisma.product.create({ data: product })
    }
  }

  console.log("Seed completed: roles, users and products created")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
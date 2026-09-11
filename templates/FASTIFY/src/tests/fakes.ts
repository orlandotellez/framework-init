import { Prisma } from "@prisma/client"

export function makeP2002(target: string[]) {
  const error = new Prisma.PrismaClientKnownRequestError(
    `Unique constraint failed on the fields: (\`${target.join("`,`")}\`)`,
    { code: "P2002", clientVersion: "6.0.0" },
  )
  Object.assign(error, { meta: { target } })
  return error
}

export function makeP2003(target: string) {
  const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
    code: "P2003",
    clientVersion: "6.0.0",
  })
  Object.assign(error, { meta: { field_name: target } })
  return error
}
import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "../src/lib/prisma"

async function main() {
  // Wipe
  await prisma.invitationCode.deleteMany()
  await prisma.user.deleteMany()
  console.log("✅ Database wiped (users + invitations)")

  const hashedPassword = await bcrypt.hash("test1234", 10)

  const admin = await prisma.user.create({
    data: {
      email: "cedric.test@local.dev",
      username: "admin",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  })

  console.log("✅ Admin user created:", admin.username)
  console.log("   Login email: cedric.test@local.dev")
  console.log("   Password: test1234")

  const code = await prisma.invitationCode.create({
    data: {
      code: "WCL-2026-TEST",
      createdById: admin.id,
    },
  })

  console.log("✅ Invitation code created:", code.code)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

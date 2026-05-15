"use server"

import { signIn, signOut } from "@/../auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    redirect("/login?error=missing")
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=invalid")
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const invitationCode = formData.get("invitationCode") as string

  // Validation basique
  if (!email || !username || !password || !invitationCode) {
    redirect("/register?error=missing")
  }

  if (password.length < 8) {
    redirect("/register?error=password_short")
  }

  if (username.length < 3) {
    redirect("/register?error=username_short")
  }

  // Vérifier que le code d'invitation correspond au code de la League
  const validCode = process.env.INVITATION_CODE
  if (!validCode || invitationCode !== validCode) {
    redirect("/register?error=invalid_code")
  }

  // Vérifier l'unicité de l'email et du username
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  })
  if (existingEmail) {
    redirect("/register?error=email_taken")
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  })
  if (existingUsername) {
    redirect("/register?error=username_taken")
  }

  // Hash du password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Création du user
  await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  })

  // Login automatique après création
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/aide",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=auto_login_failed")
    }
    throw error
  }
}
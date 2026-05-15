"use server"

import { auth } from "@/../auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function updatePassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "Non authentifié" }
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { ok: false, error: "Tous les champs sont obligatoires" }
  }

  if (newPassword.length < 8) {
    return { ok: false, error: "Le nouveau mot de passe doit faire au moins 8 caractères" }
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Les mots de passe ne correspondent pas" }
  }

  // Récupère le user et vérifie l'ancien mot de passe
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user) {
    return { ok: false, error: "Utilisateur introuvable" }
  }

  const validPassword = await bcrypt.compare(currentPassword, user.password)
  if (!validPassword) {
    return { ok: false, error: "Mot de passe actuel incorrect" }
  }

  // Hash et update
  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return { ok: true }
}
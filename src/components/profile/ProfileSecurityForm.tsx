"use client"

import { useState, useTransition } from "react"
import { Pencil, X } from "@phosphor-icons/react"
import { updatePassword } from "@/lib/actions/settings"

export function ProfileSecurityForm() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = (formData: FormData) => {
    setMessage(null)
    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result.ok) {
        setMessage({ type: "success", text: "Mot de passe mis à jour ✓" })
        const form = document.getElementById("profile-password-form") as HTMLFormElement | null
        form?.reset()
        // Ferme automatiquement après 2s
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.error ?? "Erreur inconnue" })
      }
    })
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-text-secondary text-xs uppercase tracking-widest hover:bg-white/[0.06] hover:text-text-primary transition-all"
      >
        <Pencil size={14} weight="bold" />
        Changer mon mot de passe
      </button>
    )
  }

  return (
    <div className="rounded-2xl bg-black/35 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-5 md:p-6 max-w-md">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">
          Changer mon mot de passe
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setMessage(null)
          }}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={18} weight="bold" />
        </button>
      </div>

      <form id="profile-password-form" action={handleSubmit} className="space-y-3">

        <input
          type="password"
          name="currentPassword"
          required
          placeholder="Mot de passe actuel"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />

        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          placeholder="Nouveau mot de passe (8 caractères min)"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />

        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          placeholder="Confirmer le nouveau mot de passe"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />

        {/* Message feedback */}
        {message && (
          <div className={`
            text-xs font-medium px-3 py-2 rounded-lg
            ${message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
            }
          `}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-accent text-bg px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {isPending ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>

    </div>
  )
}
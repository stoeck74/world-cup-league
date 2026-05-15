"use client"

import { useState, useRef, useEffect } from "react"
import { Minus, Plus } from "@phosphor-icons/react"

type ScoreInputProps = {
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
  max?: number
}

export function ScoreInput({
  value,
  onChange,
  disabled = false,
  max = 9,
}: ScoreInputProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus auto sur l'input quand on entre en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const isPristine = value === null
  const displayValue = value ?? 0

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    if (isPristine) {
      // Premier clic + : passe de null à 1
      onChange(1)
    } else if (displayValue < max) {
      onChange(displayValue + 1)
    }
  }

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    if (displayValue > 0) {
      onChange(displayValue - 1)
    }
  }

  // Clic sur le chiffre → entre en mode édition clavier
  const handleNumberClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled || isPristine) return
    setEditValue(String(displayValue))
    setIsEditing(true)
  }

  // Validation du clavier
  const commitEdit = () => {
    const num = parseInt(editValue, 10)
    if (!isNaN(num) && num >= 0 && num <= max) {
      onChange(num)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commitEdit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsEditing(false)
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex items-center justify-center gap-4 select-none
        ${disabled ? "opacity-50" : ""}
      `}
    >
      {/* Bouton − (caché si pristine) */}
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || displayValue === 0}
        className={`
          flex items-center justify-center w-6 h-6
          transition-all duration-200
          ${isHovered && !disabled && !isPristine ? "opacity-100 text-accent" : "opacity-0 text-text-muted"}
          ${displayValue === 0 || isPristine ? "pointer-events-none" : "hover:scale-110 cursor-pointer"}
        `}
        aria-label="Décrémenter"
      >
        <Minus size={16} weight="bold" />
      </button>

      {/* Chiffre, tiret, ou input édition */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={editValue}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 2)
            setEditValue(v)
          }}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="
            w-10 text-center text-3xl md:text-4xl font-black leading-none tabular-nums
            bg-transparent border-b-2 border-accent text-text-primary
            outline-none focus:ring-0
          "
        />
      ) : (
        <span
          onClick={handleNumberClick}
          className={`
            text-3xl md:text-4xl font-black leading-none tabular-nums
            transition-colors duration-200
            ${isPristine
              ? "text-text-muted"
              : "text-text-primary cursor-text hover:text-accent"
            }
          `}
        >
          {isPristine ? "–" : displayValue}
        </span>
      )}

      {/* Bouton + */}
      <button
        type="button"
        onClick={increment}
        disabled={disabled || displayValue >= max}
        className={`
          flex items-center justify-center w-6 h-6
          transition-all duration-200
          ${isHovered && !disabled ? "opacity-100 text-accent" : "opacity-0 text-text-muted"}
          ${displayValue >= max ? "pointer-events-none" : "hover:scale-110 cursor-pointer"}
        `}
        aria-label="Incrémenter"
      >
        <Plus size={16} weight="bold" />
      </button>
    </div>
  )
}
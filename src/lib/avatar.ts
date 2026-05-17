export function buildAvatarUrl(style: string | null, seed: string | null, username: string): string {
  const finalStyle = style ?? "toon-head"
  const finalSeed = seed ?? username
  return `https://api.dicebear.com/9.x/${finalStyle}/svg?seed=${encodeURIComponent(finalSeed)}`
}
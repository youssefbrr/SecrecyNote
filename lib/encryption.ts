import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const algorithm = "aes-256-cbc"

if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters long')
}

const key = Buffer.from(process.env.ENCRYPTION_KEY)

export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(16) // Generate a new IV for each encryption
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

export async function decrypt(text: string): Promise<string> {
  const [ivHex, encryptedHex] = text.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedHex, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}


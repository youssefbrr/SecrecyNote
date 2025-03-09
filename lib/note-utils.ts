import { Note } from "@prisma/client";

type NoteWithRequiredFields = {
  expirationType: string;
  expiration: string | null;
  created: Date | string;
};

/**
 * Checks if a note has expired based on its expiration settings
 * @param note The note object to check (can be a full Note or just an object with required fields)
 * @returns A boolean indicating whether the note has expired
 */
export function isNoteExpired(note: Note | NoteWithRequiredFields): boolean {
  if (note.expirationType === "never") return false;

  if (note.expirationType === "time" && note.expiration) {
    const expirationDate = new Date(note.created);

    // Convert UI-friendly formats to calculation format
    let expirationValue = note.expiration;

    if (note.expiration === "5 minutes") {
      expirationValue = "5m";
    } else if (note.expiration === "1 hour") {
      expirationValue = "1h";
    } else if (note.expiration === "1 day") {
      expirationValue = "1d";
    } else if (note.expiration === "7 days") {
      expirationValue = "7d";
    } else if (note.expiration === "30 days") {
      expirationValue = "30d";
    }

    const matches = expirationValue.match(/(\d+)([mhd])/);

    if (!matches) {
      return false;
    }

    const amount = parseInt(matches[1], 10);
    const unit = matches[2];

    switch (unit) {
      case "m":
        expirationDate.setMinutes(expirationDate.getMinutes() + amount);
        break;
      case "h":
        expirationDate.setHours(expirationDate.getHours() + amount);
        break;
      case "d":
        expirationDate.setDate(expirationDate.getDate() + amount);
        break;
      default:
        return false;
    }

    const now = new Date();
    return now > expirationDate;
  }

  // For view-based expiration, we assume it's not expired until viewed
  return false;
}

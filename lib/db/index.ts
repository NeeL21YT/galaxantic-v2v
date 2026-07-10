/**
 * lib/db/index.ts
 *
 * Barrel re-export for all database helper modules.
 * Import from here to keep call sites clean:
 *   import { getProfile, updateProfile } from "@/lib/db"
 */

export * from "./profiles";

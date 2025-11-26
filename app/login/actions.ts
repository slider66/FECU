"use server";

import { cookies } from "next/headers";

export async function login(email: string, pass: string) {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "alex@merle.es";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        // Set a simple session cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        return { success: true };
    }

    return { success: false };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
}

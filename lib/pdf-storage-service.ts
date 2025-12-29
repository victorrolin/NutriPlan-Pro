import { createClient } from "@/lib/supabase/client"

export class PdfStorageService {
    /**
     * Upload PDF from blob URL to Supabase Storage
     */
    static async uploadPdfFromBlob(
        blobUrl: string,
        userId: string,
        planName?: string
    ): Promise<{ url: string | null; error: string | null }> {
        try {
            console.log("[PdfStorageService] Uploading PDF from blob:", blobUrl)

            // Fetch the blob
            const response = await fetch(blobUrl)
            if (!response.ok) {
                throw new Error("Failed to fetch PDF from blob URL")
            }

            const blob = await response.blob()
            console.log("[PdfStorageService] Blob fetched, size:", blob.size)

            // Generate file name
            const timestamp = Date.now()
            const safePlanName = planName?.replace(/[^a-z0-9]/gi, "_") || "plano"
            const fileName = `${timestamp}_${safePlanName}.pdf`
            const filePath = `${userId}/${fileName}`

            console.log("[PdfStorageService] Uploading to path:", filePath)

            // Upload to Supabase Storage
            const supabase = await createClient()
            const { data, error } = await supabase.storage
                .from("diet-plans")
                .upload(filePath, blob, {
                    contentType: "application/pdf",
                    cacheControl: "3600",
                    upsert: false,
                })

            if (error) {
                console.error("[PdfStorageService] Upload error:", error)
                return { url: null, error: error.message }
            }

            console.log("[PdfStorageService] Upload successful:", data)

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("diet-plans")
                .getPublicUrl(filePath)

            console.log("[PdfStorageService] Public URL:", urlData.publicUrl)

            return { url: urlData.publicUrl, error: null }
        } catch (error: any) {
            console.error("[PdfStorageService] Exception:", error)
            return { url: null, error: error.message || "Failed to upload PDF" }
        }
    }

    /**
     * Delete PDF from storage
     */
    static async deletePdf(filePath: string): Promise<{ success: boolean; error: string | null }> {
        try {
            const supabase = await createClient()
            const { error } = await supabase.storage.from("diet-plans").remove([filePath])

            if (error) {
                console.error("[PdfStorageService] Delete error:", error)
                return { success: false, error: error.message }
            }

            return { success: true, error: null }
        } catch (error: any) {
            console.error("[PdfStorageService] Delete exception:", error)
            return { success: false, error: error.message || "Failed to delete PDF" }
        }
    }

    /**
     * Get public URL for a file path
     */
    static async getPublicUrl(filePath: string): Promise<string> {
        const supabase = await createClient()
        const { data } = supabase.storage.from("diet-plans").getPublicUrl(filePath)
        return data.publicUrl
    }

    /**
     * List all PDFs for a user
     */
    static async listUserPdfs(userId: string): Promise<{ files: any[]; error: string | null }> {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase.storage.from("diet-plans").list(userId)

            if (error) {
                console.error("[PdfStorageService] List error:", error)
                return { files: [], error: error.message }
            }

            return { files: data || [], error: null }
        } catch (error: any) {
            console.error("[PdfStorageService] List exception:", error)
            return { files: [], error: error.message || "Failed to list PDFs" }
        }
    }
}

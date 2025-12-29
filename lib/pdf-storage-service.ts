export class PdfStorageService {
    /**
     * Upload PDF from blob URL to Supabase Storage via API route
     */
    static async uploadPdfFromBlob(
        blobUrl: string,
        userId: string,
        planName?: string
    ): Promise<{ url: string | null; error: string | null }> {
        try {
            console.log("[PdfStorageService] Uploading PDF via API route:", blobUrl)

            // Call API route to upload (uses service role on server)
            const response = await fetch('/api/upload-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blobUrl, userId, planName }),
            })

            const result = await response.json()

            if (!response.ok || result.error) {
                console.error("[PdfStorageService] Upload error:", result.error)
                return { url: null, error: result.error || 'Upload failed' }
            }

            console.log("[PdfStorageService] Upload successful:", result.url)
            return { url: result.url, error: null }
        } catch (error: any) {
            console.error("[PdfStorageService] Exception:", error)
            return { url: null, error: error.message || "Failed to upload PDF" }
        }
    }

    /**
     * Delete PDF from storage (not implemented - would need API route)
     */
    static async deletePdf(filePath: string): Promise<{ success: boolean; error: string | null }> {
        return { success: false, error: "Not implemented" }
    }

    /**
     * Get public URL for a file path
     */
    static async getPublicUrl(filePath: string): Promise<string> {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        return `${supabaseUrl}/storage/v1/object/public/diet-plans/${filePath}`
    }

    /**
     * List all PDFs for a user (not implemented - would need API route)
     */
    static async listUserPdfs(userId: string): Promise<{ files: any[]; error: string | null }> {
        return { files: [], error: "Not implemented" }
    }
}

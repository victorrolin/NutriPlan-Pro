export class PdfStorageService {
    /**
     * Download PDF from blob URL and convert to base64
     */
    static async downloadAndConvertToBase64(blobUrl: string): Promise<{ base64: string | null; error: string | null }> {
        try {
            console.log("[PdfStorageService] Downloading PDF from blob:", blobUrl)

            // Fetch the blob
            const response = await fetch(blobUrl)
            if (!response.ok) {
                throw new Error("Failed to fetch PDF from blob URL")
            }

            const blob = await response.blob()
            console.log("[PdfStorageService] Blob fetched, size:", blob.size)

            // Convert blob to base64
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const base64 = reader.result as string
                    // Remove data URL prefix (data:application/pdf;base64,)
                    const base64Data = base64.split(',')[1]
                    console.log("[PdfStorageService] Converted to base64, length:", base64Data.length)
                    resolve({ base64: base64Data, error: null })
                }
                reader.onerror = () => {
                    console.error("[PdfStorageService] FileReader error")
                    resolve({ base64: null, error: "Failed to convert PDF to base64" })
                }
                reader.readAsDataURL(blob)
            })
        } catch (error: any) {
            console.error("[PdfStorageService] Exception:", error)
            return { base64: null, error: error.message || "Failed to download PDF" }
        }
    }

    /**
     * Convert base64 to blob URL for viewing
     */
    static base64ToBlobUrl(base64: string): string {
        try {
            // Add data URL prefix
            const dataUrl = `data:application/pdf;base64,${base64}`

            // Convert to blob
            const byteCharacters = atob(base64)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/pdf' })

            // Create blob URL
            const blobUrl = URL.createObjectURL(blob)
            console.log("[PdfStorageService] Created blob URL from base64")
            return blobUrl
        } catch (error: any) {
            console.error("[PdfStorageService] Error creating blob URL:", error)
            return ''
        }
    }

    /**
     * Legacy method - now just returns the URL as-is
     */
    static async uploadPdfFromBlob(
        blobUrl: string,
        userId: string,
        planName?: string
    ): Promise<{ url: string | null; error: string | null }> {
        // This method is kept for compatibility but doesn't do anything
        // The actual base64 conversion happens in AssessmentFlow
        return { url: blobUrl, error: null }
    }
}

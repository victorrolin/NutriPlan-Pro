import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const { blobUrl, userId, planName } = await request.json()

        console.log('[Save PDF API] Received request:', { blobUrl, userId, planName })

        // Fetch the blob
        const response = await fetch(blobUrl)
        if (!response.ok) {
            throw new Error('Failed to fetch PDF from blob URL')
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        console.log('[Save PDF API] PDF fetched, size:', buffer.length)

        // Generate file name
        const timestamp = Date.now()
        const safePlanName = planName?.replace(/[^a-z0-9]/gi, '_') || 'plano'
        const fileName = `${timestamp}_${safePlanName}.pdf`

        // Create directory structure: public/pdfs/{userId}/
        const userDir = path.join(process.cwd(), 'public', 'pdfs', userId)

        if (!existsSync(userDir)) {
            await mkdir(userDir, { recursive: true })
            console.log('[Save PDF API] Created directory:', userDir)
        }

        // Save file
        const filePath = path.join(userDir, fileName)
        await writeFile(filePath, buffer)

        console.log('[Save PDF API] File saved:', filePath)

        // Generate public URL
        const publicUrl = `/pdfs/${userId}/${fileName}`
        const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}${publicUrl}`

        console.log('[Save PDF API] Public URL:', fullUrl)

        return NextResponse.json({ url: fullUrl, error: null })
    } catch (error: any) {
        console.error('[Save PDF API] Exception:', error)
        return NextResponse.json({ url: null, error: error.message }, { status: 500 })
    }
}

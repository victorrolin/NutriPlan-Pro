import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { blobUrl, userId, planName } = await request.json()

        console.log('[Upload API] Received request:', { blobUrl, userId, planName })

        // Fetch the blob
        const response = await fetch(blobUrl)
        if (!response.ok) {
            throw new Error('Failed to fetch PDF from blob URL')
        }

        const blob = await response.blob()
        console.log('[Upload API] Blob fetched, size:', blob.size)

        // Generate file name
        const timestamp = Date.now()
        const safePlanName = planName?.replace(/[^a-z0-9]/gi, '_') || 'plano'
        const fileName = `${timestamp}_${safePlanName}.pdf`
        const filePath = `${userId}/${fileName}`

        // Create Supabase client with service role (bypasses RLS)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Upload to Storage
        const { data, error } = await supabase.storage
            .from('diet-plans')
            .upload(filePath, blob, {
                contentType: 'application/pdf',
                cacheControl: '3600',
                upsert: false,
            })

        if (error) {
            console.error('[Upload API] Upload error:', error)
            return NextResponse.json({ url: null, error: error.message }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('diet-plans')
            .getPublicUrl(filePath)

        console.log('[Upload API] Upload successful:', urlData.publicUrl)

        return NextResponse.json({ url: urlData.publicUrl, error: null })
    } catch (error: any) {
        console.error('[Upload API] Exception:', error)
        return NextResponse.json({ url: null, error: error.message }, { status: 500 })
    }
}

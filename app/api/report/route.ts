import { NextResponse } from 'next/server';

// Prevent Next.js from clearing this in dev mode across reloads
declare global {
    var latestReport: any;
}
globalThis.latestReport = globalThis.latestReport || null;

export async function POST(request: Request) {
    try {
        const data = await request.json();
        if (data && data.projectName && data.dependencies) {
            globalThis.latestReport = data;

            // Notify connected SSE clients
            if (globalThis.clients) {
                const encoder = new TextEncoder();
                globalThis.clients.forEach(client => {
                    client.write(encoder.encode(`data: ${JSON.stringify({ type: 'update' })}\n\n`)).catch(() => { });
                });
            }

            return NextResponse.json({ success: true, message: 'Report updated successfully' });
        }
        return NextResponse.json({ success: false, message: 'Invalid report format' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to process report' }, { status: 500 });
    }
}

export async function GET() {
    if (globalThis.latestReport) {
        return NextResponse.json({ success: true, data: globalThis.latestReport });
    }
    // Return 200 instead of 404 so we don't spam the developer console during polling
    return NextResponse.json({ success: true, data: null });
}

export async function DELETE() {
    globalThis.latestReport = null;
    return NextResponse.json({ success: true, message: 'Report cleared successfully' });
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

declare global {
    var clients: any[];
}
globalThis.clients = globalThis.clients || [];

export async function GET(request: Request) {
    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    globalThis.clients.push(writer);

    request.signal.addEventListener('abort', () => {
        globalThis.clients = globalThis.clients.filter(client => client !== writer);
        writer.close().catch(() => { });
    });

    return new Response(responseStream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}

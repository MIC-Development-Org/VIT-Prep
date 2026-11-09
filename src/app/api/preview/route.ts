import { NextRequest, NextResponse } from 'next/server';
import { File as MegaFile } from 'megajs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
  }

  // Handle Mega.nz / Mega.io links by streaming the decrypted authentic PDF directly
  if (fileUrl.includes('mega.nz') || fileUrl.includes('mega.io')) {
    try {
      const megaFile = MegaFile.fromURL(fileUrl);
      await megaFile.loadAttributes();

      const buffer = await megaFile.downloadBuffer({});

      // Detect total page count from PDF binary structure
      const pdfText = buffer.toString('latin1');
      const detectedPages = (pdfText.match(/\/Type\s*\/Page\b/g) || []).length;
      const totalPages = detectedPages > 0 ? detectedPages : 2;

      const fallbackName = (megaFile.name || 'question-paper.pdf')
        .replace(/[^\x20-\x7e]/g, '_')
        .replace(/["\\;]/g, '_');

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${fallbackName}"`,
          'Content-Length': String(buffer.length),
          'X-Total-Pages': String(totalPages),
          'Access-Control-Expose-Headers': 'X-Total-Pages, Content-Length',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    } catch (err) {
      console.error('Mega stream proxy error:', err);
      return NextResponse.json(
        { error: 'Failed to stream document from archive.' },
        { status: 502 },
      );
    }
  }

  // If it's already a direct PDF URL, redirect directly
  return NextResponse.redirect(fileUrl);
}

export async function HEAD(request: NextRequest) {
  return GET(request);
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    
    // Sanitize documentId to prevent directory traversal
    const safeDocId = documentId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!safeDocId) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }

    const searchDirs = [
      path.join(process.cwd(), 'uploads'),
      path.join(os.tmpdir(), 'uploads'),
    ];

    
    // Look for matching files with common extensions
    const candidates = [
      `${safeDocId}.pdf`,
      `${safeDocId}.txt`,
      `${safeDocId}.md`,
      `${safeDocId}.docx`,
      safeDocId
    ];

    let foundFile: string | null = null;
    for (const dir of searchDirs) {
      if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) continue;
      for (const cand of candidates) {
        const p = path.join(/*turbopackIgnore: true*/ dir, cand);
        if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
          foundFile = p;
          break;
        }
      }
      if (foundFile) break;
    }

    if (!foundFile) {
      return NextResponse.json({ error: 'Document file not found' }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(/*turbopackIgnore: true*/ foundFile);

    const ext = path.extname(foundFile).toLowerCase();

    let contentType = 'application/pdf';
    if (ext === '.txt') contentType = 'text/plain; charset=utf-8';
    else if (ext === '.md') contentType = 'text/markdown; charset=utf-8';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(foundFile)}"`,
        'Cache-Control': 'public, max-age=86400',
        'Accept-Ranges': 'bytes',
        'Content-Length': fileBuffer.length.toString(),
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error reading document';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const safeDocId = documentId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!safeDocId) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const candidates = [
      `${safeDocId}.pdf`,
      `${safeDocId}.txt`,
      `${safeDocId}.md`,
      `${safeDocId}.docx`,
      safeDocId
    ];

    let deleted = false;
    for (const cand of candidates) {
      const p = path.join(uploadsDir, cand);
      if (fs.existsSync(p)) {
        await fs.promises.unlink(p);
        deleted = true;
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting document';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


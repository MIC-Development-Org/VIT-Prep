'use client';

export async function downloadResourceFile(fileUrl: string, title: string): Promise<void> {
  if (!fileUrl.startsWith('/api/upload/download/')) {
    if (fileUrl.startsWith('https://')) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    throw new Error('This resource does not have a downloadable file.');
  }

  const response = await fetch(fileUrl);
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || 'File download failed.');
  }

  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = title;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

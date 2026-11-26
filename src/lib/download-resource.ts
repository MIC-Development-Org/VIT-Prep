'use client';

export async function downloadResourceFile(fileUrl: string, title: string): Promise<void> {
  // If it's a Mega archive link, download via our streaming proxy so the student gets the real PDF directly!
  const downloadEndpoint =
    fileUrl.includes('mega.nz') || fileUrl.includes('mega.io')
      ? `/api/preview?url=${encodeURIComponent(fileUrl)}`
      : fileUrl;

  if (
    !downloadEndpoint.startsWith('/api/upload/download/') &&
    !downloadEndpoint.startsWith('/api/preview')
  ) {
    if (fileUrl.startsWith('https://')) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    throw new Error('This resource does not have a downloadable file.');
  }

  const response = await fetch(downloadEndpoint);
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || 'File download failed.');
  }

  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = title.toLowerCase().endsWith('.pdf') ? title : `${title}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

const fileCache = new Map<string, File>();
const activeBlobUrls = new Map<string, string>();

export function addFile(fileId: string, file: File): string {
  fileCache.set(fileId, file);
  revokeUrl(fileId);
  const url = URL.createObjectURL(file);
  activeBlobUrls.set(fileId, url);
  return url;
}

export function revokeUrl(fileId: string) {
  const old = activeBlobUrls.get(fileId);
  if (old) {
    URL.revokeObjectURL(old);
    activeBlobUrls.delete(fileId);
  }
}

export function restoreUrl(fileId: string): string | null {
  if (activeBlobUrls.has(fileId)) return activeBlobUrls.get(fileId)!;
  const file = fileCache.get(fileId);
  if (!file) return null;
  const url = URL.createObjectURL(file);
  activeBlobUrls.set(fileId, url);
  return url;
}

export function getFile(fileId: string): File | undefined {
  return fileCache.get(fileId);
}

export function pruneOrphanedUrls(allFileIds: Set<string>) {
  for (const [id] of activeBlobUrls) {
    if (!allFileIds.has(id)) revokeUrl(id);
  }
  for (const [id] of fileCache) {
    if (!allFileIds.has(id)) fileCache.delete(id);
  }
}

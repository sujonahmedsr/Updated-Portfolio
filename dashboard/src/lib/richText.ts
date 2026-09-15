export function getRichTextExcerpt(html: string | undefined | null, length = 180) {
  const plainText = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > length ? `${plainText.slice(0, length).trim()}...` : plainText;
}
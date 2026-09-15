export function sanitizeRichHtml(html: string | undefined | null) {
    return (html || '')
        .replace(/<\/?(script|style|iframe|object|embed|form)[^>]*>/gi, '')
        .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/\sstyle\s*=\s*["']([^"']*)["']/gi, (_match, style: string) => {
            const textAlign = style.match(/text-align\s*:\s*(left|center|right|justify)/i)?.[1];
            return textAlign ? ` style="text-align: ${textAlign}"` : '';
        })
        .replace(/\s(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '')
        .replace(/<([a-z][a-z0-9]*)\b([^>]*)>/gi, (_fullTag, tagName: string, attributes: string) => {
            const safeAttributes = attributes
                .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
                .replace(/\s(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '');
            return `<${tagName}${safeAttributes}>`;
        });
}

const DEFAULT_API_ORIGIN = 'https://server-anvesha.onrender.com';

/** Backend origin (no trailing slash, no /api suffix). */
export function getApiOrigin(): string {
    const raw =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_API_BASE ||
        DEFAULT_API_ORIGIN;

    return raw.replace(/\/+$/, '').replace(/\/api$/i, '');
}

/** Full API base URL, e.g. https://example.com/api */
export function getApiBaseUrl(): string {
    return `${getApiOrigin()}/api`;
}

/**
 * Security Testing Helper Functions
 * 
 * Utilities for testing security vulnerabilities including:
 * - Malicious file generation
 * - SQL injection patterns
 * - XSS attack vectors
 * - Authentication helpers
 */

/**
 * Creates a malicious file for testing file upload security
 */
export function createMaliciousFile(type: 'executable' | 'script' | 'oversized' | 'invalid-mime'): File {
    switch (type) {
        case 'executable':
            // Simulate an executable file disguised as an image
            const exeContent = new Uint8Array([0x4D, 0x5A]); // MZ header (Windows executable)
            return new File([exeContent], 'malicious.exe', { type: 'application/x-msdownload' });

        case 'script':
            // JavaScript file disguised as image
            const scriptContent = 'alert("XSS")';
            return new File([scriptContent], 'malicious.jpg', { type: 'text/javascript' });

        case 'oversized':
            // File larger than 8MB limit
            const largeContent = new Uint8Array(9 * 1024 * 1024); // 9MB
            return new File([largeContent], 'oversized.jpg', { type: 'image/jpeg' });

        case 'invalid-mime':
            // PDF disguised as image
            const pdfContent = '%PDF-1.4';
            return new File([pdfContent], 'fake-image.jpg', { type: 'application/pdf' });

        default:
            throw new Error('Invalid malicious file type');
    }
}

/**
 * Creates a valid test image file
 */
export function createValidImageFile(name: string = 'test-image.jpg', sizeKB: number = 100): File {
    // Create a minimal valid JPEG file
    const jpegHeader = new Uint8Array([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
        0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01
    ]);

    const jpegFooter = new Uint8Array([0xFF, 0xD9]);

    // Fill with dummy data to reach desired size
    const fillSize = (sizeKB * 1024) - jpegHeader.length - jpegFooter.length;
    const fillData = new Uint8Array(fillSize).fill(0);

    const combined = new Uint8Array(jpegHeader.length + fillData.length + jpegFooter.length);
    combined.set(jpegHeader, 0);
    combined.set(fillData, jpegHeader.length);
    combined.set(jpegFooter, jpegHeader.length + fillData.length);

    return new File([combined], name, { type: 'image/jpeg' });
}

/**
 * SQL Injection test patterns
 */
export const SQL_INJECTION_PATTERNS = [
    "'; DROP TABLE photos; --",
    "' OR '1'='1",
    "1' UNION SELECT * FROM photos--",
    "admin'--",
    "' OR 1=1--",
    "'; DELETE FROM photos WHERE '1'='1",
    "1' AND '1'='1",
    "' UNION SELECT NULL, NULL, NULL--",
];

/**
 * XSS attack test patterns
 */
export const XSS_PATTERNS = [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "<svg/onload=alert('XSS')>",
    "javascript:alert('XSS')",
    "<iframe src='javascript:alert(\"XSS\")'></iframe>",
    "<body onload=alert('XSS')>",
    "<<SCRIPT>alert('XSS');//<</SCRIPT>",
    "<SCRIPT SRC=http://evil.com/xss.js></SCRIPT>",
];

/**
 * Path traversal attack patterns
 */
export const PATH_TRAVERSAL_PATTERNS = [
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\config\\sam",
    "....//....//....//etc/passwd",
    "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
];

/**
 * Creates a mock authenticated session cookie
 */
export function createAuthCookie(): string {
    return 'admin_session=true; HttpOnly; Path=/; Max-Age=604800';
}

/**
 * Attempts SQL injection on a given input
 */
export function attemptSQLInjection(input: string, pattern: string): string {
    return input + pattern;
}

/**
 * Attempts XSS on a given input
 */
export function attemptXSS(input: string, pattern: string): string {
    return input + pattern;
}

/**
 * Verifies if a string has been properly sanitized
 */
export function isSanitized(input: string, output: string): boolean {
    // Check if dangerous characters are escaped or removed
    const dangerousChars = ['<', '>', '"', "'", '&', ';'];

    for (const char of dangerousChars) {
        if (input.includes(char) && output.includes(char)) {
            // Character should be escaped or removed
            return false;
        }
    }

    return true;
}

/**
 * Creates FormData for photo upload testing
 */
export function createPhotoUploadFormData(
    repairNumber: string,
    stage: 'ENTRY' | 'EXIT',
    images: File[],
    technician?: string,
    comments?: string
): FormData {
    const formData = new FormData();
    formData.append('repairNumber', repairNumber);
    formData.append('stage', stage);

    if (technician) {
        formData.append('technician', technician);
    }

    if (comments) {
        formData.append('comments', comments);
    }

    images.forEach(image => {
        formData.append('images', image);
    });

    return formData;
}

/**
 * Simulates a login request
 */
export async function simulateLogin(email: string, password: string): Promise<{ success: boolean }> {
    // This would be replaced with actual API call in integration tests
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'alex@merle.es';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return { success: true };
    }

    return { success: false };
}

/**
 * Generates random string for testing
 */
export function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Validates session cookie security flags
 */
export function validateSessionCookie(cookieString: string): {
    hasHttpOnly: boolean;
    hasSecure: boolean;
    hasPath: boolean;
    hasMaxAge: boolean;
} {
    return {
        hasHttpOnly: cookieString.includes('HttpOnly'),
        hasSecure: cookieString.includes('Secure'),
        hasPath: cookieString.includes('Path=/'),
        hasMaxAge: cookieString.includes('Max-Age'),
    };
}

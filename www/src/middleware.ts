// middleware.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
	const userAgent = request.headers.get("user-agent") || "";

	let browser = "unknown";

	// Chromium family
	if (/edg/i.test(userAgent)) {
		browser = "edge";
	} else if (/opr\//i.test(userAgent)) {
		browser = "opera";
	} else if (/vivaldi/i.test(userAgent)) {
		// Vivaldi doesn't always expose itself, fallback to Chrome Web Store
		browser = "vivaldi";
	} else if (/brave/i.test(userAgent)) {
		// Brave often hides UA, but sometimes exposes "Brave"
		browser = "brave";
	} else if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) {
		browser = "chrome";
	}

	// Non-Chromium browsers
	else if (
		/safari/i.test(userAgent) &&
		!/chrome|crios|android/i.test(userAgent)
	) {
		browser = "safari";
	} else if (/firefox|fxios/i.test(userAgent)) {
		browser = "firefox";
	}

	const url = request.nextUrl;

	// Prevent infinite redirect loops
	if (url.searchParams.get("browser") !== browser) {
		url.searchParams.set("browser", browser);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

// Configure which routes should trigger this middleware
export const config = {
	matcher: ["/"], // adjust to routes you want browser detection on
};

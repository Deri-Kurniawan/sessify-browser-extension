// middleware.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
	const userAgent = request.headers.get("user-agent") || "";

	let browser = "unknown";
	let device = "desktop";

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

	// Device detection
	const mobileRegex =
		/mobile|android|iphone|ipod|blackberry|windows phone|kindle|silk|playbook|bb10/i;
	const tabletRegex = /ipad|tablet|playbook|silk|kindle/i;

	if (mobileRegex.test(userAgent) && !tabletRegex.test(userAgent)) {
		device = "mobile";
	} else {
		device = "desktop";
	}

	const url = request.nextUrl;

	// Prevent infinite redirect loops
	const currentBrowser = url.searchParams.get("browser");
	const currentDevice = url.searchParams.get("device");

	if (currentBrowser !== browser || currentDevice !== device) {
		url.searchParams.set("browser", browser);
		url.searchParams.set("device", device);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

// Configure which routes should trigger this middleware
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Regex patterns for browser detection
const edgeRegex = /edg/i;
const operaRegex = /opr\//i;
const vivaldiRegex = /vivaldi/i;
const braveRegex = /brave/i;
const chromeRegex = /chrome|crios/i;
const safariRegex = /safari/i;
const chromeCriOSAndroidRegex = /chrome|crios|android/i;
const firefoxRegex = /firefox|fxios/i;

// Regex patterns for device detection
const mobileRegex =
  /mobile|android|iphone|ipod|blackberry|windows phone|kindle|silk|playbook|bb10/i;
const tabletRegex = /ipad|tablet|playbook|silk|kindle/i;

export default function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  let browser = "unknown";

  // Chromium family
  if (edgeRegex.test(userAgent)) {
    browser = "edge";
  } else if (operaRegex.test(userAgent)) {
    browser = "opera";
  } else if (vivaldiRegex.test(userAgent)) {
    // Vivaldi doesn't always expose itself, fallback to Chrome Web Store
    browser = "vivaldi";
  } else if (braveRegex.test(userAgent)) {
    // Brave often hides UA, but sometimes exposes "Brave"
    browser = "brave";
  } else if (chromeRegex.test(userAgent) && !edgeRegex.test(userAgent)) {
    browser = "chrome";
  }

  // Non-Chromium browsers
  else if (
    safariRegex.test(userAgent) &&
    !chromeCriOSAndroidRegex.test(userAgent)
  ) {
    browser = "safari";
  } else if (firefoxRegex.test(userAgent)) {
    browser = "firefox";
  }

  // Device detection
  let device = "desktop";
  if (tabletRegex.test(userAgent)) {
    device = "tablet";
  } else if (mobileRegex.test(userAgent)) {
    device = "mobile";
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

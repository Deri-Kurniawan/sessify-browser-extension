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

const mobileRegex =
  /mobile|android|iphone|ipod|blackberry|windows phone|kindle|silk|playbook|bb10/i;
const tabletRegex = /ipad|tablet|playbook|silk|kindle/i;

export default function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  let browser = "unknown";

  if (edgeRegex.test(userAgent)) {
    browser = "edge";
  } else if (operaRegex.test(userAgent)) {
    browser = "opera";
  } else if (vivaldiRegex.test(userAgent)) {
    browser = "vivaldi";
  } else if (braveRegex.test(userAgent)) {
    browser = "brave";
  } else if (chromeRegex.test(userAgent) && !edgeRegex.test(userAgent)) {
    browser = "chrome";
  } else if (
    safariRegex.test(userAgent) &&
    !chromeCriOSAndroidRegex.test(userAgent)
  ) {
    browser = "safari";
  } else if (firefoxRegex.test(userAgent)) {
    browser = "firefox";
  }

  let device = "desktop";
  if (tabletRegex.test(userAgent)) {
    device = "tablet";
  } else if (mobileRegex.test(userAgent)) {
    device = "mobile";
  }

  // Pass browser and device info via headers (no redirect)
  const response = NextResponse.next();
  response.headers.set("x-browser", browser);
  response.headers.set("x-device", device);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

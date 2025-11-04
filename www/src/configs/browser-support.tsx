import { FaChrome, FaEdge, FaOpera } from "react-icons/fa";
import { SiBrave, SiFirefoxbrowser, SiVivaldi } from "react-icons/si";

export const browserSupport = [
    {
        name: "chrome",
        storeUrl:
            "https://chromewebstore.google.com/detail/fanchobbdinkeiainjehcdkmdggdclkc?utm_source=item-share-cb",
        icon: <FaChrome className="size-5" />,
    },
    {
        name: "edge",
        storeUrl:
            "https://microsoftedge.microsoft.com/addons/detail/sessify/agaognhoaaiimiajnnanlcmnfgoipffk",
        icon: <FaEdge className="size-5" />,
    },
    {
        name: "opera",
        storeUrl:
            "https://chromewebstore.google.com/detail/fanchobbdinkeiainjehcdkmdggdclkc?utm_source=item-share-cb",
        icon: <FaOpera className="size-5" />,
    },
    {
        name: "brave",
        storeUrl:
            "https://chromewebstore.google.com/detail/fanchobbdinkeiainjehcdkmdggdclkc?utm_source=item-share-cb",
        icon: <SiBrave className="size-5" />,
    },
    {
        name: "vivaldi",
        storeUrl:
            "https://chromewebstore.google.com/detail/fanchobbdinkeiainjehcdkmdggdclkc?utm_source=item-share-cb",
        icon: <SiVivaldi className="size-5" />,
    },
    {
        name: "firefox",
        storeUrl: "https://addons.mozilla.org/en-US/firefox/addon/sessify",
        icon: <SiFirefoxbrowser className="size-5" />,
        mobileSupport: true,
    },
];
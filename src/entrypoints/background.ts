import { SessifyExtension } from "@/background/SessifyExtension";

export default defineBackground(() => {
	SessifyExtension.prototype.init();
});

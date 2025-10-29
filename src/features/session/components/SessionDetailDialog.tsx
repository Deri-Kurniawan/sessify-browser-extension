import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronDownIcon,
	ChevronRightIcon,
	CircleQuestionMarkIcon,
} from "lucide-react";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Browser } from "#imports";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useSessions } from "@/features/session/context/SessionContext";

interface SessionDetailDialogDialogProps {
	id: string;
	children: React.ReactNode;
}

const SessionDetailDialogSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

const SessionDetailDialogDialog: FC<SessionDetailDialogDialogProps> = ({
	id,
	children,
}) => {
	const { sessions, updateSessionById } = useSessions();
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [expandedSections, setExpandedSections] = useState({
		localStorage: false,
		sessionStorage: false,
		cookies: false,
	});
	const form = useForm<z.infer<typeof SessionDetailDialogSchema>>({
		resolver: zodResolver(SessionDetailDialogSchema),
		defaultValues: { title: "" },
	});

	const session = sessions.find((s) => s.id === id);

	useEffect(() => {
		if (isOpen && session) {
			form.reset({ title: session.title });
		}
	}, [isOpen, session, form]);

	const handleUpdate = async (
		data: z.infer<typeof SessionDetailDialogSchema>,
	) => {
		if (isSubmitting) return;

		setIsSubmitting(true);
		try {
			const result = await updateSessionById(id, data);
			if (result.success) {
				setIsOpen(false);
				form.reset();
			} else {
				toast.error(
					result.message || "Could not update session. Please try again.",
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatStorageData = (
		data: Record<string, string> | Browser.cookies.Cookie[],
	) => {
		const entries = Object.entries(data);
		if (entries.length === 0) return "No data";
		return `${entries.length} item${entries.length > 1 ? "s" : ""}`;
	};

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Session Details</DialogTitle>
					<DialogDescription>
						Details about the session and its stored data.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleUpdate)}>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Session 1"
											disabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2 mt-6">
							<DialogClose asChild>
								<Button variant="outline" disabled={isSubmitting}>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting}>
								Update
							</Button>
						</div>

						{session && (
							<div className="mt-6 space-y-4">
								<div className="pt-4 border-t">
									<h3 className="mb-3 text-sm font-medium text-gray-900">
										Session Details
									</h3>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="font-medium text-gray-700">
												Created:
											</span>
											<p className="text-gray-600">
												{moment(session.createdAt).format("LLL")}
											</p>
										</div>
										<div>
											<span className="font-medium text-gray-700">
												Updated:
											</span>
											<p className="text-gray-600">
												{moment(session.updatedAt).format("LLL")}
											</p>
										</div>
									</div>
								</div>

								<div className="pt-4 border-t">
									<h3 className="mb-3 text-sm font-medium text-gray-900">
										Domain Information
									</h3>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="block font-medium text-gray-700">
												Domain:
											</span>
											<a
												href={`http://${session.domain.domain}`}
												target="_blank"
												rel="noreferrer"
												className="text-gray-600 hover:underline"
											>
												{session.domain.domain}
											</a>
										</div>
										<div>
											<span className="flex items-center gap-1 font-medium text-gray-700">
												<span>FQDN:</span>
												<Tooltip>
													<TooltipTrigger asChild>
														<CircleQuestionMarkIcon className="size-4" />
													</TooltipTrigger>
													<TooltipContent className="max-w-xs">
														Fully Qualified Domain Name (FQDN) is the complete
														domain name for a specific computer, or host, on the
														internet. It includes both the hostname and the
														domain name, providing an absolute path to the host
														within the Domain Name System (DNS) hierarchy.
													</TooltipContent>
												</Tooltip>
											</span>
											<a
												href={`http://${session.domain.fqdn}`}
												target="_blank"
												rel="noreferrer"
												className="text-gray-600 hover:underline"
											>
												{session.domain.fqdn}
											</a>
										</div>
										<div>
											<span className="flex items-center gap-1 font-medium text-gray-700">
												<span>SLD:</span>
												<Tooltip>
													<TooltipTrigger asChild>
														<CircleQuestionMarkIcon className="size-4" />
													</TooltipTrigger>
													<TooltipContent className="max-w-xs">
														Second Level Domain (SLD) is the part of a domain
														name that is directly to the left of the top-level
														domain (TLD). For example, in "example.com",
														"example" is the SLD.
													</TooltipContent>
												</Tooltip>
											</span>
											<p className="text-gray-600">{session.domain.sld}</p>
										</div>
										<div>
											<span className="flex items-center gap-1 font-medium text-gray-700">
												<span>TLD:</span>
												<Tooltip>
													<TooltipTrigger asChild>
														<CircleQuestionMarkIcon className="size-4" />
													</TooltipTrigger>
													<TooltipContent className="max-w-xs">
														Top Level Domain (TLD) is the last segment of a
														domain name, located after the final dot. Common
														examples include ".com", ".org", and ".net", as well
														as country-specific TLDs like ".id" or even
														".my.id".
													</TooltipContent>
												</Tooltip>
											</span>
											<p className="text-gray-600">{session.domain.tld}</p>
										</div>
										<div>
											<span className="block font-medium text-gray-700">
												Subdomain:
											</span>
											<p className="text-gray-600">
												{session.domain.subdomain || "None"}
											</p>
										</div>
										<div>
											<span className="block font-medium text-gray-700">
												Type:
											</span>
											<p className="text-gray-600">
												{session.domain.isIp ? "IP Address" : "Domain"}
												{session.domain.isIcann ? " (ICANN)" : ""}
											</p>
										</div>
									</div>
								</div>

								<div className="pt-4 border-t">
									<h3 className="mb-3 text-sm font-medium text-gray-900">
										Stored Data
									</h3>

									<div className="space-y-3">
										{/* Local Storage */}
										<div className="border rounded-lg">
											<button
												type="button"
												onClick={() => toggleSection("localStorage")}
												className="flex items-center justify-between w-full p-3 text-left transition-colors hover:bg-gray-50"
											>
												<div className="flex items-center justify-between flex-1 gap-2">
													<span className="font-medium text-gray-700">
														Local Storage
													</span>
													<span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
														{formatStorageData(session.state.localStorage)}
													</span>
												</div>
												{expandedSections.localStorage ? (
													<ChevronDownIcon className="w-4 h-4 text-gray-500" />
												) : (
													<ChevronRightIcon className="w-4 h-4 text-gray-500" />
												)}
											</button>
											{expandedSections.localStorage && (
												<div className="flex px-3 pb-3">
													<pre className="flex-1 w-0 p-2 mt-2 overflow-x-auto text-xs border rounded max-h-40 bg-gray-50">
														{/* add nums */}
														<code>
															{JSON.stringify(
																session.state.localStorage,
																null,
																2,
															)}
														</code>
													</pre>
												</div>
											)}
										</div>

										{/* Session Storage */}
										<div className="border rounded-lg">
											<button
												type="button"
												onClick={() => toggleSection("sessionStorage")}
												className="flex items-center justify-between w-full p-3 text-left transition-colors hover:bg-gray-50"
											>
												<div className="flex items-center justify-between flex-1 gap-2">
													<span className="font-medium text-gray-700">
														Session Storage
													</span>
													<span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
														{formatStorageData(session.state.sessionStorage)}
													</span>
												</div>
												{expandedSections.sessionStorage ? (
													<ChevronDownIcon className="w-4 h-4 text-gray-500" />
												) : (
													<ChevronRightIcon className="w-4 h-4 text-gray-500" />
												)}
											</button>
											{expandedSections.sessionStorage && (
												<div className="flex px-3 pb-3">
													<pre className="flex-1 w-0 p-2 mt-2 overflow-x-auto text-xs border rounded max-h-40 bg-gray-50">
														<code>
															{JSON.stringify(
																session.state.sessionStorage,
																null,
																2,
															)}
														</code>
													</pre>
												</div>
											)}
										</div>

										{/* Cookies */}
										<div className="border rounded-lg">
											<button
												type="button"
												onClick={() => toggleSection("cookies")}
												className="flex items-center justify-between w-full p-3 text-left transition-colors hover:bg-gray-50"
											>
												<div className="flex items-center justify-between flex-1 gap-2">
													<span className="font-medium text-gray-700">
														Cookies
													</span>
													<span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
														{formatStorageData(session.state.cookies)}
													</span>
												</div>
												{expandedSections.cookies ? (
													<ChevronDownIcon className="w-4 h-4 text-gray-500" />
												) : (
													<ChevronRightIcon className="w-4 h-4 text-gray-500" />
												)}
											</button>
											{expandedSections.cookies && (
												<div className="flex px-3 pb-3">
													<pre className="flex-1 w-0 p-2 mt-2 overflow-x-auto text-xs border rounded max-h-40 bg-gray-50">
														<code>
															{JSON.stringify(session.state.cookies, null, 2)}
														</code>
													</pre>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default SessionDetailDialogDialog;

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@sessify/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@sessify/ui/components/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@sessify/ui/components/form";
import { Input } from "@sessify/ui/components/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@sessify/ui/components/tooltip";
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
import { useSessions } from "@/features/session/context/SessionContext";

type SessionDetailDialogDialogProps = {
	id: string;
	children: React.ReactNode;
};

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
		if (isSubmitting) {
			return;
		}

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
		if (entries.length === 0) {
			return "No data";
		}
		return `${entries.length} item${entries.length > 1 ? "s" : ""}`;
	};

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-150">
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
											disabled={isSubmitting}
											placeholder="Session 1"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="mt-6 flex justify-end gap-2">
							<DialogClose asChild>
								<Button disabled={isSubmitting} variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button disabled={isSubmitting} type="submit">
								Update
							</Button>
						</div>

						{session && (
							<div className="mt-6 space-y-4">
								<div className="border-t pt-4">
									<h3 className="mb-3 font-medium text-gray-900 text-sm">
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

								<div className="border-t pt-4">
									<h3 className="mb-3 font-medium text-gray-900 text-sm">
										Domain Information
									</h3>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="block font-medium text-gray-700">
												Domain:
											</span>
											<a
												className="text-gray-600 hover:underline"
												href={`http://${session.domain.domain}`}
												rel="noreferrer"
												target="_blank"
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
												className="text-gray-600 hover:underline"
												href={`http://${session.domain.fqdn}`}
												rel="noreferrer"
												target="_blank"
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

								<div className="border-t pt-4">
									<h3 className="mb-3 font-medium text-gray-900 text-sm">
										Stored Data
									</h3>

									<div className="space-y-3">
										{/* Local Storage */}
										<div className="rounded-lg border">
											<button
												className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
												onClick={() => toggleSection("localStorage")}
												type="button"
											>
												<div className="flex flex-1 items-center justify-between gap-2">
													<span className="font-medium text-gray-700">
														Local Storage
													</span>
													<span className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-xs">
														{formatStorageData(session.state.localStorage)}
													</span>
												</div>
												{expandedSections.localStorage ? (
													<ChevronDownIcon className="h-4 w-4 text-gray-500" />
												) : (
													<ChevronRightIcon className="h-4 w-4 text-gray-500" />
												)}
											</button>
											{expandedSections.localStorage && (
												<div className="flex px-3 pb-3">
													<pre className="mt-2 max-h-40 w-0 flex-1 overflow-x-auto rounded border bg-gray-50 p-2 text-xs">
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
										<div className="rounded-lg border">
											<button
												className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
												onClick={() => toggleSection("sessionStorage")}
												type="button"
											>
												<div className="flex flex-1 items-center justify-between gap-2">
													<span className="font-medium text-gray-700">
														Session Storage
													</span>
													<span className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-xs">
														{formatStorageData(session.state.sessionStorage)}
													</span>
												</div>
												{expandedSections.sessionStorage ? (
													<ChevronDownIcon className="h-4 w-4 text-gray-500" />
												) : (
													<ChevronRightIcon className="h-4 w-4 text-gray-500" />
												)}
											</button>
											{expandedSections.sessionStorage && (
												<div className="flex px-3 pb-3">
													<pre className="mt-2 max-h-40 w-0 flex-1 overflow-x-auto rounded border bg-gray-50 p-2 text-xs">
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
										<div className="rounded-lg border">
											<button
												className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
												onClick={() => toggleSection("cookies")}
												type="button"
											>
												<div className="flex flex-1 items-center justify-between gap-2">
													<span className="font-medium text-gray-700">
														Cookies
													</span>
													<span className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-xs">
														{formatStorageData(session.state.cookies)}
													</span>
												</div>
												{expandedSections.cookies ? (
													<ChevronDownIcon className="h-4 w-4 text-gray-500" />
												) : (
													<ChevronRightIcon className="h-4 w-4 text-gray-500" />
												)}
											</button>
											{expandedSections.cookies && (
												<div className="flex px-3 pb-3">
													<pre className="mt-2 max-h-40 w-0 flex-1 overflow-x-auto rounded border bg-gray-50 p-2 text-xs">
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

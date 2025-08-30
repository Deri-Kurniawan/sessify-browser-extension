import {
	PlusIcon,
	SaveIcon,
	Trash2Icon,
	UserRoundPlusIcon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useSessions } from "@/hooks/useSessions";
import { cn } from "@/lib/utils";
import ContentWrapper from "../ContentWrapper";
import Placeholder, {
	PlaceholderDescription,
	PlaceholderIcon,
	PlaceholderTitle,
} from "../Placeholder";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const SessionPage = () => {
	const {
		sessions,
		activeSessionId,
		refreshCurrentTab,
		loadSessions,
		createNewSession,
		saveNewSession,
		deleteSessionById,
		switchSessionById,
	} = useSessions();

	const handleClickSaveSession = useCallback(async () => {
		saveNewSession().then((res) => {
			if (!res.success) {
				toast.error(`Failed to save session: ${res.message}`);
				return;
			}
			loadSessions();
		});
	}, [loadSessions, saveNewSession]);

	const handleDelelteSessionById = useCallback(
		(id: string) => {
			deleteSessionById(id).then((res) => {
				if (!res.success) {
					toast.error(`Failed to delete session: ${res.message}`);
					return;
				}
				loadSessions();
			});
		},
		[deleteSessionById, loadSessions],
	);

	const handleSwitchSessionById = useCallback(
		(id: string) => {
			switchSessionById(id).then((res) => {
				if (!res.success) {
					toast.error(`Failed to switch session: ${res.message}`);
					return;
				}
				loadSessions();
				refreshCurrentTab();
			});
		},
		[switchSessionById, loadSessions, refreshCurrentTab],
	);

	const handleCreateNewSession = useCallback(() => {
		createNewSession().then((res) => {
			if (!res.success) {
				toast.error(`Failed to create new session: ${res.message}`);
				return;
			}
			loadSessions();
			refreshCurrentTab();
		});
	}, [createNewSession, loadSessions, refreshCurrentTab]);

	const SessionItem = useCallback(
		({ session }: { session: AppSession }) => {
			return (
				// biome-ignore lint/a11y/useSemanticElements: we handle keydown event
				<li
					key={session.id}
					className={cn(
						"flex items-center gap-4 p-4 bg-neutral-50 rounded-lg shadow border cursor-pointer select-none",
						session.id === activeSessionId
							? "border-blue-500 hover:border-blue-600"
							: "border-transparent hover:border-gray-400",
					)}
					onClick={() => handleSwitchSessionById(session.id)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleSwitchSessionById(session.id);
						}
					}}
					tabIndex={0}
					// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: we handle keydown event
					role="button"
					aria-pressed={session.id === activeSessionId}
				>
					<img
						className="inline-block object-cover rounded size-7"
						src={session.appIconUrl}
						alt={session.title}
					/>
					<div className="flex flex-col flex-1 w-full">
						<span className="text-base font-medium text-gray-900 line-clamp-1">
							{session.title}
						</span>
						<span className="text-sm text-gray-500 line-clamp-1">
							{session.domain}
						</span>
					</div>
					{/** biome-ignore lint/a11y/noStaticElementInteractions: we need to use stopPropagation */}
					<div
						className="flex float-right gap-2"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						<Dialog>
							<Tooltip delayDuration={1000}>
								<TooltipTrigger asChild>
									<DialogTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="text-red-500 hover:text-red-600"
											aria-label={`Delete ${session.title}`}
										>
											<Trash2Icon className="size-5" />
											<span className="sr-only">Delete Session</span>
										</Button>
									</DialogTrigger>
								</TooltipTrigger>
								<TooltipContent>
									<p>Delete this session</p>
								</TooltipContent>
							</Tooltip>
							<DialogContent className="max-h-screen overflow-y-auto">
								<DialogHeader>
									<DialogTitle>
										Are you sure you want to delete this session?
									</DialogTitle>
									<DialogDescription>
										This action cannot be undone.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<DialogClose asChild>
										<Button
											variant={"destructive"}
											onClick={() => handleDelelteSessionById(session.id)}
										>
											Delete
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</li>
			);
		},
		[activeSessionId, handleDelelteSessionById, handleSwitchSessionById],
	);

	return (
		<>
			<TopBar title="Sessify">
				<Dialog>
					<Tooltip delayDuration={200}>
						<DialogTrigger asChild>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon">
									<PlusIcon className="size-5" />
									<span className="sr-only">New Session</span>
								</Button>
							</TooltipTrigger>
						</DialogTrigger>
						<TooltipContent>
							<p>Start a new session</p>
						</TooltipContent>
					</Tooltip>
					<DialogContent className="max-h-screen overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Create a new session?</DialogTitle>
							<DialogDescription>
								Have you saved your current session? We will clear your current
								session's tabs.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button onClick={handleCreateNewSession}>Continue</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<Tooltip delayDuration={200}>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleClickSaveSession}
						>
							<SaveIcon className="size-5" />
							<span className="sr-only">Save Session</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Save your current session</p>
					</TooltipContent>
				</Tooltip>
			</TopBar>
			<ContentWrapper className="overflow-y-scroll transition-all duration-200 ease-in-out">
				{sessions.length > 0 ? (
					<ul className="grid w-full grid-cols-1 gap-4 p-4 transition-all duration-200 ease-in-out sm:grid-cols-2 lg:grid-cols-3">
						{sessions.map((session) => (
							<SessionItem key={session.id} session={session} />
						))}
						<li className="col-span-full">
							<Button
								variant="outline"
								className="w-full gap-2"
								onClick={handleClickSaveSession}
							>
								<SaveIcon className="size-4" />
								Save New Session
							</Button>
						</li>
					</ul>
				) : (
					<div className="flex items-center justify-center size-full">
						<Placeholder
							title="No sessions yet"
							description="Save your current tab session to easily switch between different accounts"
						>
							<PlaceholderIcon>
								<UserRoundPlusIcon className="text-gray-400 size-12" />
							</PlaceholderIcon>
							<PlaceholderTitle />
							<PlaceholderDescription />
							<Button onClick={handleClickSaveSession} className="gap-2 mt-4">
								<SaveIcon className="size-4" />
								Save your first session
							</Button>
						</Placeholder>
					</div>
				)}
			</ContentWrapper>
		</>
	);
};

export default SessionPage;

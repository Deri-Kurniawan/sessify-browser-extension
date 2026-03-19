import { Button } from "@sessify/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sessify/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sessify/ui/components/tooltip";
import { cn } from "@sessify/ui/lib/utils";
import {
  BadgeInfoIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import type { Session } from "@/entities/session";
import { useSessionManagement } from "@/features/session-management";
import {
  ContentWrapper,
  Placeholder,
  PlaceholderDescription,
  PlaceholderIcon,
  PlaceholderTitle,
  TopBar,
} from "@/shared/ui";
import SessionDetailDialog from "./session-detail-dialog";

type SessionCardProps = {
  activeSessionId: string;
  session: Session;
  onDelete: (sessionId: string) => void;
  onActivate: (sessionId: string) => void;
};

function SessionCard({
  activeSessionId,
  session,
  onDelete,
  onActivate,
}: SessionCardProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-lg border bg-neutral-50 p-4 shadow",
        session.id === activeSessionId
          ? "border-blue-500 hover:border-blue-600"
          : "border-transparent hover:border-gray-400",
      )}
    >
      <button
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left"
        onClick={() => onActivate(session.id)}
        type="button"
      >
        <img
          alt={session.title}
          className="inline-block size-7 rounded object-cover"
          height={28}
          src={session.appIconUrl}
          width={28}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className="line-clamp-1 font-medium text-base text-gray-900"
            title={session.title}
          >
            {session.title}
          </span>
          <span
            className="line-clamp-1 text-gray-500 text-sm"
            title={`${session.domain.fqdn}${session.domain.port ? `:${session.domain.port}` : ""}`}
          >
            {session.domain.fqdn}
            {session.domain.port && `:${session.domain.port}`}
          </span>
        </div>
      </button>
      <div className="float-right flex gap-2">
        <SessionDetailDialog id={session.id}>
          <Button
            aria-label={`Edit ${session.title}`}
            className="text-blue-500 hover:text-blue-600"
            size="icon"
            variant="ghost"
          >
            <BadgeInfoIcon className="size-5" />
            <span className="sr-only">Edit Session</span>
          </Button>
        </SessionDetailDialog>
        <Dialog>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  aria-label={`Delete ${session.title}`}
                  className="text-red-500 hover:text-red-600"
                  size="icon"
                  variant="ghost"
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
                  onClick={() => onDelete(session.id)}
                  variant="destructive"
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
}

const SessionsPage = () => {
  const {
    sessions,
    activeSessionId,
    reloadActiveTab,
    listSessions,
    createEmptySession,
    saveActiveTabSession,
    deleteSession,
    activateSession,
  } = useSessionManagement();

  const handleSaveSessionClick = useCallback(() => {
    saveActiveTabSession().then((response) => {
      if (!response.success) {
        toast.error(
          response.message
            ? `Could not save session: ${response.message}`
            : "Could not save session. Please try again.",
        );
        return;
      }
      void listSessions();
    });
  }, [listSessions, saveActiveTabSession]);

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      deleteSession(sessionId).then((response) => {
        if (!response.success) {
          toast.error(
            response.message
              ? `Could not delete session: ${response.message}`
              : "Could not delete session. Please try again.",
          );
          return;
        }
        void listSessions();
      });
    },
    [deleteSession, listSessions],
  );

  const handleActivateSession = useCallback(
    (sessionId: string) => {
      activateSession(sessionId).then((response) => {
        if (!response.success) {
          toast.error(`Failed to switch session: ${response.message}`);
          return;
        }
        void listSessions();
        void reloadActiveTab();
      });
    },
    [activateSession, listSessions, reloadActiveTab],
  );

  const handleCreateEmptySession = useCallback(() => {
    createEmptySession().then((response) => {
      if (!response.success) {
        toast.error(`Failed to create new session: ${response.message}`);
        return;
      }
      void listSessions();
      void reloadActiveTab();
    });
  }, [createEmptySession, listSessions, reloadActiveTab]);

  return (
    <>
      <TopBar title="Sessify">
        <Dialog>
          <Tooltip delayDuration={200}>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
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
                session&apos;s tabs.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreateEmptySession}>Continue</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSaveSessionClick}
              size="icon"
              variant="ghost"
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
            <li className="col-span-full">
              <Button
                className="w-full gap-2"
                onClick={handleSaveSessionClick}
                variant="outline"
              >
                <SaveIcon className="size-4" />
                Save New Session
              </Button>
            </li>
            {sessions.map((session) => (
              <SessionCard
                activeSessionId={activeSessionId}
                key={session.id}
                onActivate={handleActivateSession}
                onDelete={handleDeleteSession}
                session={session}
              />
            ))}
          </ul>
        ) : (
          <div className="flex size-full items-center justify-center">
            <Placeholder
              description="Save your current tab session to easily switch between different accounts"
              title="No sessions yet"
            >
              <PlaceholderIcon>
                <UserRoundPlusIcon className="size-12 text-gray-400" />
              </PlaceholderIcon>
              <PlaceholderTitle />
              <PlaceholderDescription />
              <Button className="mt-4 gap-2" onClick={handleSaveSessionClick}>
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

export default SessionsPage;

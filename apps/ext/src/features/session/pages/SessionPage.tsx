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
import ContentWrapper from "@/components/ContentWrapper";
import Placeholder, {
  PlaceholderDescription,
  PlaceholderIcon,
  PlaceholderTitle,
} from "@/components/Placeholder";
import TopBar from "@/components/TopBar";
import { useSessions } from "@/features/session/context/SessionContext";
import EditSessionDialog from "../components/SessionDetailDialog";

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

  const handleClickSaveSession = useCallback(() => {
    saveNewSession().then((res) => {
      if (!res.success) {
        toast.error(
          res.message
            ? `Could not save session: ${res.message}`
            : "Could not save session. Please try again.",
        );
        return;
      }
      loadSessions();
    });
  }, [loadSessions, saveNewSession]);

  const handleDeleteSessionById = useCallback(
    (id: string) => {
      deleteSessionById(id).then((res) => {
        if (!res.success) {
          toast.error(
            res.message
              ? `Could not delete session: ${res.message}`
              : "Could not delete session. Please try again.",
          );
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
          aria-pressed={session.id === activeSessionId}
          className={cn(
            "flex cursor-pointer select-none items-center gap-4 rounded-lg border bg-neutral-50 p-4 shadow",
            session.id === activeSessionId
              ? "border-blue-500 hover:border-blue-600"
              : "border-transparent hover:border-gray-400",
          )}
          key={session.id}
          onClick={() => handleSwitchSessionById(session.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSwitchSessionById(session.id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <img
            alt={session.title}
            className="inline-block size-7 rounded object-cover"
            height={28}
            src={session.appIconUrl}
            width={28}
          />
          <div className="flex w-full flex-1 flex-col">
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
          <div
            className="float-right flex gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <EditSessionDialog id={session.id}>
              <Button
                aria-label={`Edit ${session.title}`}
                className="text-blue-500 hover:text-blue-600"
                size="icon"
                variant="ghost"
              >
                <BadgeInfoIcon className="size-5" />
                <span className="sr-only">Edit Session</span>
              </Button>
            </EditSessionDialog>
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
                      onClick={() => handleDeleteSessionById(session.id)}
                      variant={"destructive"}
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
    [activeSessionId, handleDeleteSessionById, handleSwitchSessionById],
  );

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
              onClick={handleClickSaveSession}
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
                onClick={handleClickSaveSession}
                variant="outline"
              >
                <SaveIcon className="size-4" />
                Save New Session
              </Button>
            </li>
            {sessions.map((session) => (
              <SessionItem key={session.id} session={session} />
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
              <Button className="mt-4 gap-2" onClick={handleClickSaveSession}>
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

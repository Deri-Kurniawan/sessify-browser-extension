import { Badge } from "@sessify/ui/components/badge";
import { Button } from "@sessify/ui/components/button";
import { Separator } from "@sessify/ui/components/separator";
import { cn } from "@sessify/ui/lib/utils";
import {
  BadgeInfoIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleQuestionMarkIcon,
  PlusIcon,
  SaveIcon,
  SettingsIcon,
  Trash2Icon,
  UserRoundPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { interpolate } from "remotion";
import { clamp } from "../anim";
import { UI_FONT } from "../fonts";

export const POPUP_WIDTH = 380;
export const POPUP_HEIGHT = 600;

export type SessionDomain = {
  domain: string;
  fqdn: string;
  sld: string;
  tld: string;
  subdomain: string;
  port?: number | null;
  type: string;
};

export type SessionState = {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: Record<string, string | boolean>[];
};

export type SessionItem = {
  id: string;
  title: string;
  fqdn: string;
  port?: number | null;
  color: string;
  letter: string;
  appIconUrl?: string;
  domain: SessionDomain;
  createdAt: string;
  updatedAt: string;
  state: SessionState;
};

const DOMAINS: Record<string, SessionDomain> = {
  "app.acme.co": {
    domain: "acme.co",
    fqdn: "app.acme.co",
    sld: "acme",
    tld: "co",
    subdomain: "app",
    port: null,
    type: "Domain (ICANN)",
  },
  "docs.acme.co": {
    domain: "acme.co",
    fqdn: "docs.acme.co",
    sld: "acme",
    tld: "co",
    subdomain: "docs",
    port: null,
    type: "Domain (ICANN)",
  },
  "linear.app": {
    domain: "linear.app",
    fqdn: "linear.app",
    sld: "linear",
    tld: "app",
    subdomain: "",
    port: null,
    type: "Domain (ICANN)",
  },
};

const STATE_A: SessionState = {
  localStorage: {
    authToken: "acme_live_9f2a7c",
    theme: "light",
    workspaceId: "acme-studio",
  },
  sessionStorage: {
    activeView: "overview",
    draftTask: "Design review",
  },
  cookies: [
    {
      name: "session_id",
      value: "sess_main_8f21",
      domain: ".acme.co",
      path: "/",
      httpOnly: true,
      secure: true,
    },
    {
      name: "workspace",
      value: "acme-studio",
      domain: ".acme.co",
      path: "/",
      httpOnly: false,
      secure: true,
    },
    {
      name: "csrf_token",
      value: "c0a8f2",
      domain: "app.acme.co",
      path: "/",
      httpOnly: false,
      secure: true,
    },
    {
      name: "acme_prefs",
      value: "compact",
      domain: ".acme.co",
      path: "/",
      httpOnly: false,
      secure: true,
    },
  ],
};

const favicon = (letter: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><rect width="28" height="28" rx="5" fill="${color}"/><text x="14" y="19" fill="#fff" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">${letter}</text></svg>`,
  )}`;

export const createSessionItem = (
  input: Pick<SessionItem, "title" | "fqdn"> & Partial<SessionItem>,
): SessionItem => {
  const domain = DOMAINS[input.fqdn] ?? {
    domain: input.fqdn,
    fqdn: input.fqdn,
    sld: input.fqdn.split(".")[0] ?? input.fqdn,
    tld: input.fqdn.split(".")[input.fqdn.split(".").length - 1] ?? "",
    subdomain: "",
    port: null,
    type: "Domain (ICANN)",
  };
  const color = input.color ?? "#6366f1";
  const letter = input.letter ?? "A";

  return {
    id: input.id ?? input.title.toLowerCase().replace(/\s+/g, "-"),
    title: input.title,
    fqdn: input.fqdn,
    port: input.port ?? domain.port ?? null,
    color,
    letter,
    appIconUrl: input.appIconUrl ?? favicon(letter, color),
    domain: input.domain ?? domain,
    createdAt: input.createdAt ?? "October 22, 2026 2:14 PM",
    updatedAt: input.updatedAt ?? "October 22, 2026 2:32 PM",
    state: input.state ?? STATE_A,
  };
};

export const MAIN_SESSION = createSessionItem({
  title: "Main account",
  fqdn: "app.acme.co",
  color: "#6366f1",
  letter: "A",
});

export const SECOND_SESSION = createSessionItem({
  title: "Second account",
  fqdn: "app.acme.co",
  color: "#0ea5e9",
  letter: "B",
  state: {
    localStorage: {
      authToken: "acme_live_2b7d4e",
      theme: "light",
      workspaceId: "acme-client",
    },
    sessionStorage: {
      activeView: "projects",
      draftTask: "Client handoff",
    },
    cookies: [
      {
        name: "session_id",
        value: "sess_second_41bc",
        domain: ".acme.co",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "workspace",
        value: "acme-client",
        domain: ".acme.co",
        path: "/",
        httpOnly: false,
        secure: true,
      },
      {
        name: "csrf_token",
        value: "a11c92",
        domain: "app.acme.co",
        path: "/",
        httpOnly: false,
        secure: true,
      },
    ],
  },
});

export const LINEAR_SESSION = createSessionItem({
  title: "Client workspace",
  fqdn: "linear.app",
  color: "#10b981",
  letter: "L",
  state: {
    localStorage: {
      authToken: "lin_live_c81f",
      theme: "dark",
      teamId: "acme-roadmap",
    },
    sessionStorage: {
      activeView: "roadmap",
      filter: "mine",
    },
    cookies: [
      {
        name: "linear_session",
        value: "lin_91fa",
        domain: ".linear.app",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "linear_theme",
        value: "dark",
        domain: ".linear.app",
        path: "/",
        httpOnly: false,
        secure: true,
      },
    ],
  },
});

export const PopupShell: React.FC<{
  children: ReactNode;
  scale?: number;
  style?: CSSProperties;
  width?: number;
  height?: number;
}> = ({
  children,
  scale = 1,
  style,
  width = POPUP_WIDTH,
  height = POPUP_HEIGHT,
}) => (
  <div
    className="relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-2xl"
    style={{
      boxSizing: "border-box",
      fontFamily: UI_FONT,
      height,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width,
      ...style,
    }}
  >
    {children}
  </div>
);

export const PanelShell: React.FC<{
  children: ReactNode;
  scale?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
}> = ({ children, scale = 1, width = 690, height = 816, style }) => (
  <PopupShell height={height} scale={scale} style={style} width={width}>
    {children}
  </PopupShell>
);

export const PopupTopBar: React.FC<{
  plusPress?: number;
  savePress?: number;
  title?: string;
}> = ({ plusPress = 0, savePress = 0, title = "Sessify" }) => (
  <header className="relative z-10 flex min-h-[68px] items-center justify-between bg-neutral-50 p-4 shadow">
    <h1 className="font-semibold text-xl">{title}</h1>
    <div className="flex gap-2">
      <TopBarButton pressed={plusPress}>
        <PlusIcon className="size-5" />
      </TopBarButton>
      <TopBarButton pressed={savePress}>
        <SaveIcon className="size-5" />
      </TopBarButton>
    </div>
  </header>
);

const TopBarButton: React.FC<{ children: ReactNode; pressed?: number }> = ({
  children,
  pressed = 0,
}) => (
  <Button
    aria-label="Session action"
    size="icon"
    style={{
      backgroundColor: pressed > 0.25 ? "var(--accent)" : undefined,
      transform: `scale(${1 - pressed * 0.06})`,
    }}
    tabIndex={-1}
    variant="ghost"
  >
    {children}
  </Button>
);

export const PopupBody: React.FC<{
  children: ReactNode;
  columns?: 1 | 2;
  style?: CSSProperties;
}> = ({ children, columns = 1, style }) => (
  <main
    className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background"
    style={style}
  >
    <div
      className={cn(
        "grid w-full auto-rows-min gap-4 p-4",
        columns === 2 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {children}
    </div>
  </main>
);

export const SaveNewSessionButton: React.FC<{
  style?: CSSProperties;
  pressed?: number;
}> = ({ style, pressed = 0 }) => (
  <Button
    className="w-full gap-2"
    style={{
      gridColumn: "1 / -1",
      transform: `scale(${1 - pressed * 0.02})`,
      ...style,
    }}
    tabIndex={-1}
    variant="outline"
  >
    <SaveIcon className="size-4" />
    Save New Session
  </Button>
);

export const SessionCard: React.FC<{
  session: SessionItem;
  active?: boolean;
  hover?: number;
  infoPress?: number;
  trashPress?: number;
  deleting?: number;
  style?: CSSProperties;
}> = ({
  session,
  active = false,
  hover = 0,
  infoPress = 0,
  trashPress = 0,
  deleting = 0,
  style,
}) => {
  const domainLabel = `${session.fqdn}${session.port ? `:${session.port}` : ""}`;

  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-lg border bg-neutral-50 p-4 shadow",
        active
          ? "border-blue-500"
          : hover > 0.5
            ? "border-gray-400"
            : "border-transparent",
      )}
      style={{
        opacity: 1 - deleting,
        transform: `scale(${1 - deleting * 0.04})`,
        ...style,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
        <img
          alt={session.title}
          className="inline-block size-7 rounded object-cover"
          height={28}
          src={session.appIconUrl ?? favicon(session.letter, session.color)}
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
            title={domainLabel}
          >
            {domainLabel}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <CardActionButton
          colorClassName="text-blue-500 hover:text-blue-600"
          label={`Edit ${session.title}`}
          pressed={infoPress}
        >
          <BadgeInfoIcon className="size-5" />
        </CardActionButton>
        <CardActionButton
          colorClassName="text-red-500 hover:text-red-600"
          label={`Delete ${session.title}`}
          pressed={trashPress}
        >
          <Trash2Icon className="size-5" />
        </CardActionButton>
      </div>
    </li>
  );
};

const CardActionButton: React.FC<{
  children: ReactNode;
  colorClassName: string;
  label: string;
  pressed?: number;
}> = ({ children, colorClassName, label, pressed = 0 }) => (
  <Button
    aria-label={label}
    className={colorClassName}
    size="icon"
    style={{
      backgroundColor: pressed > 0.25 ? "var(--accent)" : undefined,
      transform: `scale(${1 - pressed * 0.08})`,
    }}
    tabIndex={-1}
    variant="ghost"
  >
    {children}
  </Button>
);

export const EmptyState: React.FC<{
  title?: string;
  body?: string;
}> = ({
  title = "No sessions yet",
  body = "Save your current tab session to easily switch between different accounts",
}) => (
  <div className="col-span-full flex flex-col items-center justify-center gap-2 p-8 text-center">
    <div className="mb-4 rounded-full bg-neutral-50 p-4">
      <UserRoundPlusIcon className="size-12 text-gray-400" />
    </div>
    <h3 className="font-semibold text-gray-900 text-xl">{title}</h3>
    <p className="max-w-sm text-pretty text-gray-600">{body}</p>
    <Button className="mt-4 gap-2" tabIndex={-1}>
      <SaveIcon className="size-4" />
      Save your first session
    </Button>
  </div>
);

export const PopupNav: React.FC<{
  active?: "sessions" | "settings";
}> = ({ active = "sessions" }) => (
  <nav className="z-10 w-full bg-white">
    <ul className="flex justify-around">
      <NavItem
        active={active === "sessions"}
        icon={<UsersIcon className="size-6" />}
        label="Sessions"
      />
      <NavItem
        active={active === "settings"}
        icon={<SettingsIcon className="size-6" />}
        label="Settings"
      />
    </ul>
  </nav>
);

const NavItem: React.FC<{
  active: boolean;
  icon: ReactNode;
  label: string;
}> = ({ active, icon, label }) => (
  <li className="size-full">
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-1 p-4",
        active
          ? "bg-neutral-50 text-primary [&>span]:font-medium"
          : "bg-white text-primary/80",
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  </li>
);

const DialogShell: React.FC<{
  children: ReactNode;
  progress: number;
  width?: number;
  style?: CSSProperties;
}> = ({ children, progress, width = 348, style }) => (
  <div
    className="absolute inset-0 z-20 flex items-center justify-center bg-black/50"
    style={{ opacity: progress }}
  >
    <div
      className="relative grid gap-4 rounded-lg border bg-background p-6 shadow-lg"
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 16}px) scale(${0.96 + progress * 0.04})`,
        width,
        ...style,
      }}
    >
      <XIcon className="absolute top-4 right-4 size-4 text-muted-foreground" />
      {children}
    </div>
  </div>
);

export const ConfirmDialog: React.FC<{
  progress: number;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  pressed?: "cancel" | "confirm" | null;
  width?: number;
}> = ({
  progress,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  pressed = null,
  width = 348,
}) => (
  <DialogShell progress={progress} width={width}>
    <div className="flex flex-col gap-2 text-left">
      <div className="font-semibold text-lg leading-none">{title}</div>
      <div className="text-muted-foreground text-sm">{description}</div>
    </div>
    <div className="flex justify-end gap-2">
      <DialogButton
        label={cancelLabel}
        pressed={pressed === "cancel"}
        variant="outline"
      />
      <DialogButton
        label={confirmLabel}
        pressed={pressed === "confirm"}
        variant={destructive ? "destructive" : "primary"}
      />
    </div>
  </DialogShell>
);

const DialogButton: React.FC<{
  label: string;
  pressed: boolean;
  variant: "outline" | "primary" | "destructive";
}> = ({ label, pressed, variant }) => (
  <Button
    style={{ transform: `scale(${pressed ? 0.96 : 1})` }}
    tabIndex={-1}
    variant={
      variant === "outline"
        ? "outline"
        : variant === "destructive"
          ? "destructive"
          : "default"
    }
  >
    {label}
  </Button>
);

export const DetailDialog: React.FC<{
  progress: number;
  session: SessionItem;
  titleValue: string;
  expanded: "localStorage" | "sessionStorage" | "cookies" | null;
  scroll?: number;
  pressed?: "cancel" | "update" | null;
  width?: number;
}> = ({
  progress,
  session,
  titleValue,
  expanded,
  scroll = 0,
  pressed = null,
  width = 348,
}) => (
  <DialogShell progress={progress} width={width}>
    <div className="max-h-[480px] overflow-hidden">
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        <div className="flex flex-col gap-2 pr-6 text-left">
          <div className="font-semibold text-lg leading-none">
            Session Details
          </div>
          <div className="text-muted-foreground text-sm">
            Details about the session and its stored data.
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <label
            className="flex select-none items-center gap-2 font-medium text-sm leading-none"
            htmlFor="session-title"
          >
            Title
          </label>
          <div
            className="flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-ring bg-transparent px-3 py-1 text-base text-foreground shadow-xs ring-[3px] ring-ring/50 md:text-sm"
            id="session-title"
          >
            {titleValue || "\u00A0"}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <DialogButton
            label="Cancel"
            pressed={pressed === "cancel"}
            variant="outline"
          />
          <DialogButton
            label="Update"
            pressed={pressed === "update"}
            variant="primary"
          />
        </div>

        <Separator className="mt-6" />
        <div className="pt-4">
          <SectionTitle>Session Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailField label="Created:" value={session.createdAt} />
            <DetailField label="Updated:" value={session.updatedAt} />
          </div>
        </div>

        <Separator className="mt-4" />
        <div className="pt-4">
          <SectionTitle>Domain Information</SectionTitle>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailField label="Domain:" value={session.domain.domain} />
            <DetailField help label="FQDN:" value={session.domain.fqdn} />
            <DetailField help label="SLD:" value={session.domain.sld} />
            <DetailField help label="TLD:" value={session.domain.tld} />
            <DetailField
              label="Subdomain:"
              value={session.domain.subdomain || "None"}
            />
            <DetailField label="Type:" value={session.domain.type} />
          </div>
        </div>

        <Separator className="mt-4" />
        <div className="pt-4">
          <SectionTitle>Stored Data</SectionTitle>
          <div className="flex flex-col gap-3">
            <StorageRow
              count={Object.keys(session.state.localStorage).length}
              expanded={expanded === "localStorage"}
              label="Local Storage"
              value={session.state.localStorage}
            />
            <StorageRow
              count={Object.keys(session.state.sessionStorage).length}
              expanded={expanded === "sessionStorage"}
              label="Session Storage"
              value={session.state.sessionStorage}
            />
            <StorageRow
              count={session.state.cookies.length}
              expanded={expanded === "cookies"}
              label="Cookies"
              value={session.state.cookies}
            />
          </div>
        </div>
      </div>
    </div>
  </DialogShell>
);

const SectionTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className="mb-3 font-medium text-gray-900 text-sm">{children}</h3>
);

const DetailField: React.FC<{
  label: string;
  value: string;
  help?: boolean;
}> = ({ label, value, help = false }) => (
  <div>
    <span className="flex items-center gap-1 font-medium text-gray-700">
      <span>{label}</span>
      {help ? (
        <CircleQuestionMarkIcon className="size-4 text-gray-400" />
      ) : null}
    </span>
    <p className="break-words text-gray-600">{value}</p>
  </div>
);

const StorageRow: React.FC<{
  label: string;
  count: number;
  expanded: boolean;
  value: Record<string, string> | Record<string, string | boolean>[];
}> = ({ label, count, expanded, value }) => (
  <div className="rounded-lg border">
    <div className="flex w-full items-center justify-between p-3 text-left">
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="font-medium text-gray-700">{label}</span>
        <Badge
          className="rounded bg-gray-100 px-2 py-1 font-normal text-gray-600 text-xs"
          variant="secondary"
        >
          {count} {count === 1 ? "item" : "items"}
        </Badge>
      </div>
      {expanded ? (
        <ChevronDownIcon className="size-4 text-gray-500" />
      ) : (
        <ChevronRightIcon className="size-4 text-gray-500" />
      )}
    </div>
    {expanded ? (
      <div className="flex px-3 pb-3">
        <pre className="mt-2 max-h-40 w-0 flex-1 overflow-x-auto rounded border bg-gray-50 p-2 text-xs">
          <code>{JSON.stringify(value, null, 2)}</code>
        </pre>
      </div>
    ) : null}
  </div>
);

export const RenameDialog: React.FC<{
  progress: number;
  session: SessionItem;
  titleValue: string;
  pressed?: "cancel" | "update" | null;
  width?: number;
}> = ({ progress, session, titleValue, pressed = null, width = 348 }) => (
  <DetailDialog
    expanded={null}
    pressed={pressed}
    progress={progress}
    scroll={0}
    session={session}
    titleValue={titleValue}
    width={width}
  />
);

export const DialogFade: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    className="absolute inset-0 z-10 bg-black/50"
    style={{
      opacity: interpolate(progress, [0, 1], [0, 1], clamp),
    }}
  />
);

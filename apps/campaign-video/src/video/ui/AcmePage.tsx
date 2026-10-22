import {
  ArrowRight,
  Bell,
  Calendar,
  ChevronDown,
  FileText,
  Folder,
  Home,
  Inbox,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type { CSSProperties } from "react";
import { UI_FONT } from "../fonts";
import { UI } from "../theme";

const BORDER = `1px solid ${UI.border}`;

const NAV = [
  { icon: <Home size={18} strokeWidth={2} />, label: "Home", active: true },
  { icon: <Inbox size={18} strokeWidth={2} />, label: "Inbox", badge: "4" },
  { icon: <Folder size={18} strokeWidth={2} />, label: "Projects" },
  { icon: <Calendar size={18} strokeWidth={2} />, label: "Calendar" },
  { icon: <Users size={18} strokeWidth={2} />, label: "Team" },
  { icon: <Settings size={18} strokeWidth={2} />, label: "Settings" },
];

const PROJECTS = [
  {
    name: "Website redesign",
    meta: "12 tasks · 68%",
    color: "#6366f1",
    tag: "Design",
    progress: 0.68,
  },
  {
    name: "Q3 launch plan",
    meta: "8 tasks · 42%",
    color: "#0ea5e9",
    tag: "Marketing",
    progress: 0.42,
  },
  {
    name: "Mobile onboarding",
    meta: "17 tasks · 81%",
    color: "#10b981",
    tag: "Product",
    progress: 0.81,
  },
];

const ROWS = [
  {
    name: "Design review",
    owner: "Sam",
    status: "In progress",
    date: "Today",
    color: "#6366f1",
  },
  {
    name: "Sprint planning",
    owner: "Riley",
    status: "Review",
    date: "Tomorrow",
    color: "#0ea5e9",
  },
  {
    name: "Bug triage",
    owner: "Leo",
    status: "Done",
    date: "Fri",
    color: "#10b981",
  },
  {
    name: "Copy polish",
    owner: "Ana",
    status: "Todo",
    date: "Fri",
    color: "#f59e0b",
  },
];

const ACCOUNTS = {
  main: {
    name: "Sam",
    email: "main@acme.co",
    initials: "SM",
    workspace: "Acme Studio",
    role: "Team workspace",
    accent: "#6366f1",
    greeting: "Good morning, Sam",
  },
  second: {
    name: "Riley",
    email: "second@acme.co",
    initials: "RK",
    workspace: "Acme Client",
    role: "Client workspace",
    accent: "#0ea5e9",
    greeting: "Good morning, Riley",
  },
} as const;

export type AcmeMode = "main" | "second" | "login";

export const AcmePage: React.FC<{
  style?: CSSProperties;
  overlay?: number;
  mode?: AcmeMode;
  email?: string;
  loginPress?: number;
}> = ({
  style,
  overlay = 0,
  mode = "main",
  email = "second@acme.co",
  loginPress = 0,
}) => {
  const account = mode === "second" ? ACCOUNTS.second : ACCOUNTS.main;
  const isLogin = mode === "login";

  return (
    <div
      style={{
        background: "#fbfbfc",
        display: "flex",
        flexDirection: "column",
        fontFamily: UI_FONT,
        height: "100%",
        position: "relative",
        width: "100%",
        ...style,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#fff",
          borderBottom: BORDER,
          display: "flex",
          flex: "0 0 60px",
          gap: 28,
          justifyContent: "space-between",
          padding: "0 28px",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
          <div
            style={{
              alignItems: "center",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              borderRadius: 7,
              color: "#fff",
              display: "flex",
              fontSize: 15,
              fontWeight: 700,
              height: 30,
              justifyContent: "center",
              width: 30,
            }}
          >
            A
          </div>
          <span
            style={{
              color: UI.text,
              fontSize: 16,
              fontWeight: 650,
              letterSpacing: -0.3,
            }}
          >
            Acme Cloud
          </span>
          {isLogin ? null : (
            <div
              style={{
                alignItems: "center",
                color: UI.muted,
                display: "flex",
                gap: 4,
                marginLeft: 18,
              }}
            >
              {["Overview", "Projects", "Reports"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    background: index === 0 ? UI.surface2 : "transparent",
                    borderRadius: 5,
                    color: index === 0 ? UI.text : UI.muted,
                    fontSize: 12,
                    fontWeight: 550,
                    padding: "5px 9px",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        {isLogin ? (
          <div
            style={{
              alignItems: "center",
              color: UI.muted,
              display: "flex",
              fontSize: 12,
              gap: 6,
            }}
          >
            <Lock size={13} strokeWidth={2} />
            Secure sign in
          </div>
        ) : (
          <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
            <div
              style={{
                alignItems: "center",
                background: UI.surface,
                border: BORDER,
                borderRadius: 7,
                color: UI.mutedLight,
                display: "flex",
                fontSize: 12,
                gap: 7,
                height: 32,
                padding: "0 10px",
                width: 180,
              }}
            >
              <Search size={14} strokeWidth={2} />
              Search workspace
              <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.8 }}>
                ⌘K
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <Bell color={UI.muted} size={18} strokeWidth={2} />
              <div
                style={{
                  background: UI.red,
                  border: "2px solid #fff",
                  borderRadius: 999,
                  height: 7,
                  position: "absolute",
                  right: -2,
                  top: -2,
                  width: 7,
                }}
              />
            </div>
            <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    color: UI.text,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {account.name}
                </div>
                <div style={{ color: UI.muted, fontSize: 10, lineHeight: 1.2 }}>
                  {account.email}
                </div>
              </div>
              <div
                style={{
                  alignItems: "center",
                  background: mode === "second" ? "#e0f2fe" : "#e0e7ff",
                  borderRadius: 999,
                  color: mode === "second" ? "#0369a1" : "#4338ca",
                  display: "flex",
                  fontSize: 11,
                  fontWeight: 700,
                  height: 30,
                  justifyContent: "center",
                  width: 30,
                }}
              >
                {account.initials}
              </div>
            </div>
          </div>
        )}
      </div>

      {isLogin ? (
        <div
          style={{
            alignItems: "center",
            background:
              "radial-gradient(circle at 50% 28%, #eef2ff 0%, #fbfbfc 52%, #f8fafc 100%)",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            minHeight: 0,
            padding: 36,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: BORDER,
              borderRadius: 14,
              boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
              padding: "34px 38px 32px",
              width: 420,
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
              <div
                style={{
                  alignItems: "center",
                  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                  borderRadius: 8,
                  color: "#fff",
                  display: "flex",
                  fontSize: 16,
                  fontWeight: 700,
                  height: 34,
                  justifyContent: "center",
                  width: 34,
                }}
              >
                A
              </div>
              <div>
                <div style={{ color: UI.text, fontSize: 18, fontWeight: 650 }}>
                  Sign in to Acme Cloud
                </div>
                <div style={{ color: UI.muted, fontSize: 12, marginTop: 2 }}>
                  Continue to your workspace
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: 28,
              }}
            >
              <div>
                <div
                  style={{
                    color: UI.textSoft,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    alignItems: "center",
                    background: "#fff",
                    border: `1px solid ${UI.blue}`,
                    borderRadius: 7,
                    boxShadow: "0 0 0 3px rgba(43,127,255,0.12)",
                    display: "flex",
                    gap: 8,
                    height: 40,
                    padding: "0 11px",
                  }}
                >
                  <Mail color={UI.mutedLight} size={15} strokeWidth={2} />
                  <span style={{ color: UI.text, fontSize: 13 }}>{email}</span>
                  <span
                    style={{
                      background: UI.text,
                      display: "inline-block",
                      height: 16,
                      marginLeft: 1,
                      width: 1,
                    }}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: UI.textSoft,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Password
                </div>
                <div
                  style={{
                    alignItems: "center",
                    background: UI.surface,
                    border: BORDER,
                    borderRadius: 7,
                    display: "flex",
                    gap: 8,
                    height: 40,
                    padding: "0 11px",
                  }}
                >
                  <Lock color={UI.mutedLight} size={15} strokeWidth={2} />
                  <span
                    style={{
                      color: UI.textSoft,
                      fontSize: 16,
                      letterSpacing: 4,
                    }}
                  >
                    ••••••••
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                alignItems: "center",
                background: UI.primary,
                borderRadius: 7,
                color: "#fff",
                display: "flex",
                fontSize: 13,
                fontWeight: 600,
                gap: 8,
                height: 40,
                justifyContent: "center",
                marginTop: 22,
                transform: `scale(${1 - loginPress * 0.02})`,
              }}
            >
              Sign in
              <ArrowRight size={15} strokeWidth={2.2} />
            </div>

            <div
              style={{
                color: UI.muted,
                fontSize: 11,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Use your Acme Cloud account to continue.
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <div
            style={{
              borderRight: BORDER,
              display: "flex",
              flex: "0 0 216px",
              flexDirection: "column",
              gap: 18,
              padding: "18px 14px",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "#fff",
                border: BORDER,
                borderRadius: 7,
                display: "flex",
                gap: 8,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  background: mode === "second" ? "#0ea5e9" : "#111827",
                  borderRadius: 4,
                  height: 18,
                  width: 18,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ color: UI.text, fontSize: 11, fontWeight: 600 }}>
                  {account.workspace}
                </div>
                <div style={{ color: UI.muted, fontSize: 9.5 }}>
                  {account.role}
                </div>
              </div>
              <ChevronDown color={UI.mutedLight} size={13} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV.map((item) => (
                <div
                  key={item.label}
                  style={{
                    alignItems: "center",
                    background: item.active ? UI.surface2 : "transparent",
                    borderRadius: 6,
                    color: item.active ? UI.text : UI.muted,
                    display: "flex",
                    fontSize: 12,
                    fontWeight: item.active ? 600 : 500,
                    gap: 10,
                    padding: "8px 9px",
                  }}
                >
                  {item.icon}
                  {item.label}
                  {item.badge ? (
                    <span
                      style={{
                        background: "#eff6ff",
                        borderRadius: 999,
                        color: UI.blueDark,
                        fontSize: 9.5,
                        fontWeight: 700,
                        marginLeft: "auto",
                        padding: "1px 6px",
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div style={{ borderTop: BORDER, paddingTop: 16 }}>
              <div
                style={{
                  color: UI.mutedLight,
                  fontSize: 9.5,
                  fontWeight: 650,
                  letterSpacing: 0.7,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Favorites
              </div>
              {["Design system", "Launch assets", "Research"].map((item) => (
                <div
                  key={item}
                  style={{
                    alignItems: "center",
                    color: UI.muted,
                    display: "flex",
                    fontSize: 11.5,
                    gap: 8,
                    padding: "6px 9px",
                  }}
                >
                  <FileText size={14} strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0, padding: "26px 34px" }}>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ color: UI.muted, fontSize: 11, fontWeight: 500 }}>
                Workspace{" "}
                <span style={{ margin: "0 5px", color: UI.mutedLight }}>/</span>{" "}
                Home
              </div>
              <div
                style={{
                  alignItems: "center",
                  background: mode === "second" ? "#f0f9ff" : "#eef2ff",
                  border: `1px solid ${mode === "second" ? "#bae6fd" : "#c7d2fe"}`,
                  borderRadius: 999,
                  color: mode === "second" ? "#0369a1" : "#4338ca",
                  display: "flex",
                  fontSize: 10,
                  fontWeight: 600,
                  gap: 6,
                  padding: "5px 9px",
                }}
              >
                <div
                  style={{
                    background: mode === "second" ? "#0ea5e9" : "#6366f1",
                    borderRadius: 999,
                    height: 6,
                    width: 6,
                  }}
                />
                {account.email}
              </div>
            </div>
            <div
              style={{
                alignItems: "flex-end",
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <div>
                <div
                  style={{
                    color: UI.text,
                    fontSize: 28,
                    fontWeight: 680,
                    letterSpacing: -0.8,
                    lineHeight: 1.15,
                  }}
                >
                  {account.greeting}
                </div>
                <div style={{ color: UI.muted, fontSize: 13, marginTop: 5 }}>
                  Here is what is moving across your workspace today.
                </div>
              </div>
              <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
                <div
                  style={{
                    background: "#fff",
                    border: BORDER,
                    borderRadius: 6,
                    color: UI.textSoft,
                    fontSize: 11.5,
                    fontWeight: 550,
                    padding: "7px 11px",
                  }}
                >
                  Filter
                </div>
                <div
                  style={{
                    alignItems: "center",
                    background: UI.primary,
                    borderRadius: 6,
                    color: "#fff",
                    display: "flex",
                    fontSize: 11.5,
                    fontWeight: 550,
                    gap: 5,
                    padding: "7px 12px",
                  }}
                >
                  <Plus size={13} strokeWidth={2.4} />
                  New project
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
              {[
                {
                  label: "Active projects",
                  value: mode === "second" ? "5" : "7",
                  delta: "+2 this week",
                },
                {
                  label: "Tasks completed",
                  value: mode === "second" ? "92" : "148",
                  delta: "18% vs last week",
                },
                {
                  label: "Team members",
                  value: mode === "second" ? "4" : "12",
                  delta: "3 online now",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#fff",
                    border: BORDER,
                    borderRadius: 8,
                    flex: 1,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{ color: UI.muted, fontSize: 10.5, fontWeight: 550 }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      alignItems: "baseline",
                      display: "flex",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        color: UI.text,
                        fontSize: 24,
                        fontWeight: 680,
                        letterSpacing: -0.5,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        color: "#16a34a",
                        fontSize: 9.5,
                        fontWeight: 600,
                      }}
                    >
                      {stat.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              <div style={{ flex: 1.35, minWidth: 0 }}>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{ color: UI.text, fontSize: 13, fontWeight: 650 }}
                  >
                    {mode === "second" ? "Client projects" : "Recent projects"}
                  </div>
                  <div style={{ color: UI.muted, fontSize: 10.5 }}>
                    View all
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    border: BORDER,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  {ROWS.map((row, index) => (
                    <div
                      key={row.name}
                      style={{
                        alignItems: "center",
                        borderTop: index === 0 ? "none" : BORDER,
                        display: "flex",
                        gap: 10,
                        padding: "11px 14px",
                      }}
                    >
                      <div
                        style={{
                          background: row.color,
                          borderRadius: 4,
                          height: 20,
                          width: 20,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: UI.text,
                            fontSize: 11.5,
                            fontWeight: 550,
                          }}
                        >
                          {row.name}
                        </div>
                        <div style={{ color: UI.muted, fontSize: 9.5 }}>
                          {row.owner} · updated {row.date}
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            row.status === "Done" ? "#f0fdf4" : UI.surface2,
                          borderRadius: 999,
                          color: row.status === "Done" ? "#15803d" : UI.muted,
                          fontSize: 9,
                          fontWeight: 600,
                          padding: "3px 7px",
                        }}
                      >
                        {row.status}
                      </div>
                      <MoreHorizontal color={UI.mutedLight} size={15} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: UI.text,
                    fontSize: 13,
                    fontWeight: 650,
                    marginBottom: 10,
                  }}
                >
                  Project health
                </div>
                <div
                  style={{
                    background: "#fff",
                    border: BORDER,
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  {PROJECTS.map((project) => (
                    <div key={project.name} style={{ marginBottom: 15 }}>
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          gap: 7,
                        }}
                      >
                        <div
                          style={{
                            background: project.color,
                            borderRadius: 3,
                            height: 14,
                            width: 14,
                          }}
                        />
                        <div
                          style={{
                            color: UI.text,
                            flex: 1,
                            fontSize: 11,
                            fontWeight: 550,
                          }}
                        >
                          {project.name}
                        </div>
                        <div style={{ color: UI.muted, fontSize: 9.5 }}>
                          {project.tag}
                        </div>
                      </div>
                      <div
                        style={{
                          background: UI.surface2,
                          borderRadius: 999,
                          height: 5,
                          marginTop: 7,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            background: project.color,
                            borderRadius: 999,
                            height: "100%",
                            width: `${project.progress * 100}%`,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          color: UI.mutedLight,
                          fontSize: 9,
                          marginTop: 4,
                        }}
                      >
                        {project.meta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {overlay > 0 ? (
        <div
          style={{
            background: `rgba(10,12,20,${overlay})`,
            inset: 0,
            position: "absolute",
          }}
        />
      ) : null}
    </div>
  );
};

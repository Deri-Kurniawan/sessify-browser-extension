"use client";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

type Props = {
	repo: string;
	isUninstall?: boolean;
};

const LABEL_BY_TYPE: Record<string, string> = {
	bug: "bug",
	feature: "enhancement",
	question: "question",
	other: "feedback",
};

export default function GitHubFeedbackForm({ repo, isUninstall }: Props) {
	const [type, setType] = useState<"bug" | "feature" | "question" | "other">(
		isUninstall ? "other" : "bug",
	);
	const [title, setTitle] = useState<string>(
		isUninstall ? "Uninstall feedback" : "",
	);
	const [message, setMessage] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [reason, setReason] = useState<string>(isUninstall ? "Not useful" : "");

	const isValid = title.trim().length > 0 && message.trim().length > 0;
	const id = useId();

	const bodyTemplate = useMemo(() => {
		const lines = [
			`Type: ${type}`,
			isUninstall ? `Reason: ${reason || "N/A"}` : undefined,
			"",
			"Description:",
			message || "(please add details)",
			"",
			`Contact (optional): ${email || "N/A"}`,
			"",
			"_Submitted from the app feedback page_",
		].filter(Boolean);
		return lines.join("\n");
	}, [type, message, email, isUninstall, reason]);

	function openInNewTab(url: string) {
		window.open(url, "_blank", "noopener,noreferrer");
	}

	function openIssue() {
		const base = `https://github.com/${repo}/issues/new`;
		const params = new URLSearchParams();
		params.set("title", title);
		params.set("body", bodyTemplate);
		const label = LABEL_BY_TYPE[type];
		if (label) params.set("labels", label);
		openInNewTab(`${base}?${params.toString()}`);
	}

	function openDiscussion() {
		// GitHub Discussions supports category param; title/body may not be honored in all orgs but safe to include
		const base = `https://github.com/${repo}/discussions/new`;
		const params = new URLSearchParams();
		params.set("category", "General");
		if (title) params.set("title", title);
		if (bodyTemplate) params.set("body", bodyTemplate);
		openInNewTab(`${base}?${params.toString()}`);
	}

	return (
		<div className="flex flex-col gap-2 pt-2 sm:flex-row">
			<Button
				className="w-full sm:w-auto"
				onClick={openDiscussion}
				variant="secondary"
				disabled={!isValid}
			>
				Use GitHub Discussions
			</Button>
			<Button
				className="w-full sm:w-auto"
				onClick={openIssue}
				disabled={!isValid}
			>
				Create GitHub Issue
			</Button>
		</div>
	);
}

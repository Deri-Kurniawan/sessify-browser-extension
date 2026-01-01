import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sessify/ui/components/card";
import type { ReactNode } from "react";

export interface InfoCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function InfoCard({ title, description, children }: InfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl tracking-tight md:text-2xl">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="mt-2 text-sm leading-relaxed">
            {description}
          </CardDescription>
        )}
        {children}
      </CardHeader>
    </Card>
  );
}

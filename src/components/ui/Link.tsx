import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import React from "react";

export default function NavLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      {disabled ? (
        <> {children}</>
      ) : (
        <a
          href={href}
          className="inline-flex items-center"
          onClick={() => startTransition(() => router.push(href))}
          style={{ cursor: isPending ? "wait" : "pointer" }}
        >
          {children}
        </a>
      )}
    </>
  );
}

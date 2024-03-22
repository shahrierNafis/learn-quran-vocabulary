import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <a
      href={href}
      className="inline-flex items-center"
      onClick={() => startTransition(() => router.push(href))}
      style={{ cursor: isPending ? "wait" : "pointer" }}
    >
      {children}
    </a>
  );
}

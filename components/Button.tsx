import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  href,
  variant = "primary",
}: ButtonProps) {
  const className =
    variant === "primary"
      ? "w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition text-center block"
      : "w-full border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black py-4 rounded-xl transition text-center block";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <button className={className}>{children}</button>;
}
import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  [key: string]: unknown;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  href,
  onClick,
  type = "button",
  ...rest
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.35, ease: "power2.out" });
      gsap.to(inner, { x: x * strength * 0.6, y: y * strength * 0.6, duration: 0.35, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  const sharedProps = { className, onClick, ...rest };

  if (href !== undefined) {
    return (
      <a ref={btnRef as React.Ref<HTMLAnchorElement>} href={href} {...(sharedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <span ref={innerRef} className="inline-flex items-center gap-2">{children}</span>
      </a>
    );
  }

  return (
    <button ref={btnRef as React.Ref<HTMLButtonElement>} type={type} {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      <span ref={innerRef} className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

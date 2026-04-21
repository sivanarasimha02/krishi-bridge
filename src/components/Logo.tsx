import logo from "@/assets/krishilink-logo.jpg";

export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt="KrishiLink"
        width={size}
        height={size}
        className="rounded-md object-cover"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className="text-lg font-bold tracking-tight">
          Krishi<span className="text-secondary">Link</span>
        </span>
      )}
    </div>
  );
}

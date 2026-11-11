import { SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  placeholder: string;
};

export default function CategorySelectValue({ value, placeholder }: Props) {
  if (!value) {
    return <SelectValue placeholder={placeholder} />;
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-1 py-0.5 text-xs font-medium",
        value === "Wait repair" && "bg-yellow-100 text-yellow-800",
        value === "Idle OK" && "bg-green-100 text-green-800",
      )}
    >
      <SelectValue />
    </span>
  );
}

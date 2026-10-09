
import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner({
  message = "Loading movies...",
  fullScreen = false,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 text-gray-400 ${
        fullScreen ? "min-h-[60vh]" : "py-10"
      }`}
    >
      <LoaderCircle
        size={36}
        className="animate-spin text-blue-500"
        aria-hidden="true"
      />

      <p className="text-sm font-medium">{message}</p>

      <span className="sr-only">Please wait</span>
    </div>
  );
}

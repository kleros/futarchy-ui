import { cn } from "@/utils";

const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("flex size-full items-center justify-center", className)}
    >
      <div className="loader"></div>
    </div>
  );
};
export default Loader;

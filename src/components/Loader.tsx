import { cn } from "@/utils";

const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("loader", className)}></div>;
};
export default Loader;

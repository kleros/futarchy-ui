import Loader from "./Loader";

const FullScreenLoader: React.FC<{ message?: string }> = ({
  message = "Loading markets",
}) => {
  return (
    <div className="flex flex-1 items-center justify-center gap-4">
      <Loader />
      <p className="text-klerosUIComponentsSecondaryPurple text-base md:text-2xl">
        {message}
      </p>
    </div>
  );
};
export default FullScreenLoader;

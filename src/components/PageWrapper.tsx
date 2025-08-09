import classNames from "classnames";

export const PageWrapper: React.FC<{
  isActive: boolean;
  children: React.ReactNode;
}> = ({ isActive, children }) => {
  return (
    <div
      className={classNames(
        "absolute top-0 left-0 min-w-screen overflow-y-auto grid grid-cols-12 py-8 px-6",
        {
          "pointer-events-none": !isActive,
        }
      )}
    >
      <div className="relative overflow-x-hidden col-span-12 md:col-span-8 md:col-start-3">
        {children}
      </div>
    </div>
  );
};

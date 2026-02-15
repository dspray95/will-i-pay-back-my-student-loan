import clsx from "clsx";

export const BorderWrappers: React.FC<{
  showBottomBorder: boolean;
  children: React.ReactNode;
}> = ({ showBottomBorder, children }) => {
  return (
    <div
      className={clsx({
        "w-full min-h-svh bg-beck-beige pt-2.5 md:pt-2.5 md:px-2.5 pb-0 overflow-hidden flex flex-col": true,
        "md:pb-2.5": showBottomBorder,
      })}
    >
      <div
        className={clsx({
          "w-full flex-1 border-t-20 md:border-x-20 border-piccadilly-blue pt-1 md:pt-1 md:px-1 pb-0 flex flex-col": true,
          "border-b-20 md:pb-1": showBottomBorder,
        })}
      >
        <div
          className={clsx({
            "w-full flex flex-1 flex-col items-center border-t-[5px] md:border-x-[5px] border-piccadilly-blue pt-10 px-6 md:": true,
            "border-b-[5px] pb-10": showBottomBorder,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

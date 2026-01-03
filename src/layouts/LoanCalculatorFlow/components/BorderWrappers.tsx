import clsx from "clsx";

export const BorderWrappers: React.FC<{
  showBottomBorder: boolean;
  children: React.ReactNode;
}> = ({ showBottomBorder, children }) => {
  return (
    <div
      className={clsx({
        "w-full min-h-svh bg-beck-beige p-[10px] pb-0 overflow-hidden flex flex-col":
          true,
        "pb-[10px]": showBottomBorder,
      })}
    >
      <div
        className={clsx({
          "w-full flex-1 border-t-[20px] border-x-[20px] border-piccadilly-blue p-[4px] pb-0 flex flex-col":
            true,
          "border-b-[20px] pb-[4px]": showBottomBorder,
        })}
      >
        <div
          className={clsx({
            "w-full flex flex-1 flex-col items-center border-t-[5px] border-x-[5px] border-piccadilly-blue pt-10":
              true,
            "border-b-[5px] pb-10": showBottomBorder,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

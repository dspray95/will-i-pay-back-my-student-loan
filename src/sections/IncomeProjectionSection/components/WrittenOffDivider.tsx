export const WrittenOffDivider: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 w-full text-northern-not-black">
      <div className="grow border-b border-northern-not-black min-w-24 border-dashed" />
      <div className="text-sm">LOAN WRITTEN OFF</div>
      <div className="grow border-b border-northern-not-black min-w-24 border-dashed" />
    </div>
  );
};

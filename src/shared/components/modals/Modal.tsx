import { cn } from "../../utils/ClassNames";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center z-50 px-6 md:px-0",
        "fixed inset-0 bg-northern-not-black/20 backdrop-blur",
      )}
    >
      <div className="bg-beck-beige p-1 rounded-sm max-w-md border-4 border-piccadilly-blue">
        <div className="border border-piccadilly-blue p-4">{children}</div>
      </div>
    </div>
  );
};

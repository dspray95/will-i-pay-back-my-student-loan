import { Button } from "../Button";
import { Modal } from "./Modal";
import type { Dispatch, SetStateAction } from "react";

interface ActionConfirmationModalProps {
  title: string;
  bodyText: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
}

export const ActionConfirmationModal: React.FC<
  ActionConfirmationModalProps
> = ({ title, bodyText, showModal, setShowModal, onConfirm }) => {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <p className="mb-6">{bodyText}</p>
      <div className="flex gap-3 justify-end">
        <Button
          className="hover:text-northern-not-black-1"
          variant="base"
          onClick={() => setShowModal(false)}
        >
          CANCEL
        </Button>
        <Button
          className="text-central-red hover:text-central-red-light-1"
          variant="base"
          onClick={onConfirm}
        >
          CONTINUE
        </Button>
      </div>
    </Modal>
  );
};

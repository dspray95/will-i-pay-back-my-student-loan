import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Font } from "../Text";

export const BuyMeACoffeeLink = () => {
  return (
    <a
      href="https://buymeacoffee.com/david.spray"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 text-piccadilly-blue py-2 hover:opacity-70"
    >
      <FontAwesomeIcon icon={faMugHot} size="lg" />
      <Font.Body small className="text-piccadilly-blue">
        Buy me a coffee
      </Font.Body>
    </a>
  );
};

import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LinkedInLink = () => {
  return (
    <a
      href="https://www.linkedin.com/in/davidspray95/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-piccadilly-blue hover:opacity-70 transition-opacity"
    >
      <FontAwesomeIcon icon={faLinkedin} size="xl" />
    </a>
  );
};

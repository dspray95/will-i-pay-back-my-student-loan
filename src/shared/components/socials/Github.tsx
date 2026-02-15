import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GitHubLink = () => {
  return (
    <a
      href="https://github.com/dspray95/will-i-pay-back-my-student-loan"
      target="_blank"
      rel="noopener noreferrer"
      className="text-piccadilly-blue hover:opacity-70 transition-opacity"
    >
      <FontAwesomeIcon icon={faGithub} size="xl" />
    </a>
  );
};

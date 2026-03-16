import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GithubLink = () => {
  return (
    <a
      href="https://github.com/dspray95/great-british-write-off"
      target="_blank"
      rel="noopener noreferrer"
      className="text-piccadilly-blue hover:opacity-70 transition-opacity"
    >
      <FontAwesomeIcon icon={faGithub} size="xl" />
    </a>
  );
};

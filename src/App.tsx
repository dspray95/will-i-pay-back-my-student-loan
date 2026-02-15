import { LoanCalculatorFlow } from "./layouts/LoanCalculatorFlow/LoanCalculatorFlow";
import { GithubLink } from "./shared/components/socials/Github";
import { LinkedInLink } from "./shared/components/socials/LinkedIn";

function App() {
  return (
    <div className="app">
      <div className="hidden absolute top-14 right-14 z-50 md:flex gap-3">
        <GithubLink />
        <LinkedInLink />
      </div>
      <LoanCalculatorFlow />
    </div>
  );
}

export default App;

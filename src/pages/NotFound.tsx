import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../shared/components/Button";
import { Font } from "../shared/components/Text";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import { BorderWrappers } from "../layouts/LoanCalculatorFlow/components/BorderWrappers";

export function NotFound() {
  return (
    <BorderWrappers showBottomBorder={true} className="max-h-svh">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-4 w-fit">
          <Font.OutlineHeader>404</Font.OutlineHeader>
          <Font.H1 className="text-xl mt-2">Page Not Found</Font.H1>
          <Font.Body small className="text-xl mt-1">
            The page you're looking for doesn't exist.
          </Font.Body>
          <div className="pt-6 w-full">
            <Button className="w-full ">
              <a className="pt-1" href="/">
                RETURN TO CALCULATOR
              </a>
              <FontAwesomeIcon className="text-base" icon={faArrowRotateBack} />
            </Button>
          </div>
        </div>
      </div>
    </BorderWrappers>
  );
}

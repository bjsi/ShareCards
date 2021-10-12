import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import Socials from "./socials";

export function Footer() {
  return (
    <footer>
      <Container>
        <hr />
        <small>
          <p className="text-center">
            Experimental Learning <FontAwesomeIcon icon={faCopyright} />{" "}
            {new Date().getFullYear().toString()}
            <br />
            <Socials />
          </p>
        </small>
      </Container>
    </footer>
  );
}

import { Navbar } from "react-bootstrap";
import { useUser } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";


export function NavigationBar() {
  const { user } = useUser();

  return (
    <Navbar bg="light">
        <Navbar.Brand href="/"><h2>Share Cards</h2></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {user ? (
              <p>
              <FontAwesomeIcon icon={faUser}/> {user.name} <a href="/api/auth/logout">Logout</a>
              </p>
            ) : (
              <a href="/api/auth/login">Login</a>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>
  );
}

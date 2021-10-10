import { Navbar, Container } from "react-bootstrap";
import { useUser } from "@auth0/nextjs-auth0";

export function NavigationBar() {
  const { user } = useUser();

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">Share Cards</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {user ? (
              <p>
                Signed in as: {user.name}. <a href="/api/auth/logout">Logout</a>
              </p>
            ) : (
              <a href="/api/auth/login">Login</a>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

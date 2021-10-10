import { NavigationBar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Container } from "react-bootstrap";

interface LayoutProps {
  meta: JSX.Element;
  children: React.ReactNode;
}

export function Layout({ meta, children }: LayoutProps) {
  return (
    <>
      {meta}
      <Container>
        <NavigationBar />
        <main>{children}</main>
        <Footer />
      </Container>
    </>
  );
}

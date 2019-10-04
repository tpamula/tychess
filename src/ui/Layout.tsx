import React, { useState } from "react";
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import "./Layout.css";

const ChessNav: () => JSX.Element = () => {
  const [navbarToggled, setNavbarToggled] = useState(false);

  return (
    <Navbar color="dark" dark expand="xs">
      <Container>
        <NavbarBrand href="." color="dark">
          tychess
        </NavbarBrand>
        <NavbarToggler
          onClick={() => setNavbarToggled(!navbarToggled)}
          className="mr-2"
        />
        <Collapse isOpen={navbarToggled} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink
                href="https://github.com/tpamula/tychess"
                target="_blank"
              >
                source code
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

const Layout: React.FC = props => (
  <div id="main-wrapper">
    <ChessNav />
    <Container>{props.children}</Container>
  </div>
);

export default Layout;

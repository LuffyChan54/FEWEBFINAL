import { ReactComponentElement } from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";

const activeNavList = [
  {
    content: <>Home</>,
    path: "/",
  },
];

function ActiveNavLink({
  children,
  path,
}: {
  children: ReactComponentElement<any>;
  path: string;
}) {
  return (
    <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
      {children}
    </NavLink>
  );
}

export default function Header() {
  const navList = activeNavList.map((nav) => (
    <ActiveNavLink children={nav.content} path={nav.path} key={nav.path} />
  ));
  return (
    <div className="header">
      <ul className="nav nav-list">{navList}</ul>

      <ul className="nav nav-pages">
        <ActiveNavLink path="/signin">
          <li className="primary">Sign In</li>
        </ActiveNavLink>
        <li className="primary register">
          <Link to="signup">Register</Link>
        </li>
      </ul>
    </div>
  );
}

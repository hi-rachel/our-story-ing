import { ReactNode } from "react";
import "../i18n";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header>
        <h1>ing</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2024 ing</p>
      </footer>
    </div>
  );
};

export default Layout;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShareSquare } from "@fortawesome/free-solid-svg-icons";

const Header = (): JSX.Element => {
  return (
    <div className="header-2">
      <nav className="bg-white py-2 md:py-4">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            <a
              href="www.google.com"
              className="font-bold text-3xl text-blue-600">
              <FontAwesomeIcon icon={faShareSquare} /> Share Cards
            </a>
            <button
              className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden"
              id="navbar-toggle">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>

          <div
            className="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0"
            id="navbar-collapse">
            <a
              href="www.google.com"
              className="p-2 lg:px-4 md:mx-2 text-white rounded bg-indigo-600">
              Decks
            </a>
            <a
              href="www.google.com"
              className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300">
              About
            </a>
            <a
              href="www.google.com"
              className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center border border-transparent rounded hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-300">
              Login
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;

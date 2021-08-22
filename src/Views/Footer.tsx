import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faDiscord,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = (): JSX.Element => {
  return (
    <footer className="bg-white border-t border-gray-400 shadow m-10">
      <div className="container max-w-4xl mx-auto flex py-8">
        <div className="w-full mx-auto flex flex-wrap">
          <div className="flex w-full md:w-1/2 ">
            <div className="px-8">
              <h3 className="font-bold text-gray-900">About</h3>
              <p className="py-4 text-gray-600 text-sm">
                Made by James B | Experimental Learning
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-1/2">
            <div className="px-12">
              <h3 className="font-bold text-gray-900">Social Media</h3>
              <ul className="list-reset items-center text-sm pt-3">
                <li>
                  <a
                    className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1"
                    href="www.google.com">
                    <FontAwesomeIcon icon={faFileAlt} /> Blog
                  </a>
                </li>
                <li>
                  <a
                    className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1"
                    href="www.google.com">
                    <FontAwesomeIcon icon={faDiscord} /> Discord
                  </a>
                </li>
                <li>
                  <a
                    className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1"
                    href="www.google.com">
                    <FontAwesomeIcon icon={faYoutube} /> YouTube
                  </a>
                </li>
                <li>
                  <a
                    className="inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1"
                    href="www.google.com">
                    <FontAwesomeIcon icon={faTwitter} /> Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

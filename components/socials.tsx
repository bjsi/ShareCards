import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FA from "@fortawesome/free-brands-svg-icons";

interface SocialProps {
  icon: FA.IconDefinition;
  text: string;
  href: string;
}

const Social = ({icon, href, text}: SocialProps) => {
    return (<span className="m-1">
      <FontAwesomeIcon icon={icon}/> <a href={href}>{text}</a> 
    </span>)
}

export default function Socials() {
  return (
  <>
    <span>
      <Social icon={FA.faTwitter} href="https://twitter.com/experilearning" text="@experilearning"/>
      <Social icon={FA.faYoutube} href="https://www.youtube.com/channel/UCIaS9XDdQkvIjASBfgim1Uw" text="Experimental Learning"/>
      <Social icon={FA.faGithub} href="https://github.com/bjsi" text="bjsi"/>
    </span>
</>
  );
}

import { Link, SvgIcon } from "@material-ui/core";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/telegram.svg";

export default function Social() {
  return (
    <div className="social-row">
      {/*<Link href="https://github.com/ScholarDAO" target="_blank">*/}
      {/*  <SvgIcon color="primary" component={GitHub} />*/}
      {/*</Link>*/}

      {/*<Link href="https://ScholarDAO.medium.com/" target="_blank">*/}
      {/*  <SvgIcon color="primary" component={Medium} />*/}
      {/*</Link>*/}

      <Link href="https://twitter.com/ScholarDAO" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://t.me/+lRs3tUKyAeg1OTY5" target="_blank">
        <SvgIcon color="primary" component={Discord} />
      </Link>
    </div>
  );
}

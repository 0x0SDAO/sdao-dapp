import LogoSDOGE from "../../assets/logo192.png";
import "./notfound.scss";
import { Trans } from "@lingui/macro";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://dapp.scholardoge.ord" target="_blank">
          <img className="branding-header-icon" src={LogoSDOGE} alt="ScholarDoge" />
        </a>

        <h4 className="not-found-title">
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}

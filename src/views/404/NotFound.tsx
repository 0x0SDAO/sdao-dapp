import LogoSDAO from "../../assets/logo192.png";
import "./notfound.scss";
import { Trans } from "@lingui/macro";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://dapp.scholardao.net" target="_blank">
          <img className="branding-header-icon" src={LogoSDAO} alt="ScholarDAO" />
        </a>

        <h4 className="not-found-title">
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}

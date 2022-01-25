import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { SvgIcon } from "@material-ui/core";
import { Trans } from "@lingui/macro";

const externalUrls = [
  // {
  //   title: <Trans>Governance</Trans>,
  //   url: "https://vote.scholardao.net/",
  //   icon: <SvgIcon color="primary" component={GovIcon} />,
  // },
  {
    title: <Trans>Docs</Trans>,
    url: "https://0x0-github.gitbook.io/scholardao/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  // {
  //   title: "Feedback",
  //   url: "https://scholardoge.canny.io/",
  //   icon: <SvgIcon color="primary" component={FeedbackIcon} />,
  // },
];

export default externalUrls;

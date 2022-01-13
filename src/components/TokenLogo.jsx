import { Box, SvgIcon } from "@material-ui/core";

function TokenLogo({ svg, marginRight }) {
  let viewBox = "0 0 32 32";
  let style = { height: "32px", width: "32px", marginRight: marginRight};

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"32px"}>
      <SvgIcon component={svg} viewBox={viewBox} style={style} />
    </Box>
  );
}

export default TokenLogo;

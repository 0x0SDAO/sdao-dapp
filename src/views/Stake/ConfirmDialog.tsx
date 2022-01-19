import { Box, Grid, Switch, Typography, Paper } from "@material-ui/core";
import { ChangeEvent, useMemo, useState } from "react";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip";

export interface ConfirmDialogProps {
  quantity: string;
  currentIndex: string;
  view: number;
  onConfirm: (value: boolean) => void;
}

export function ConfirmDialog({ quantity, currentIndex, view, onConfirm }: ConfirmDialogProps) {
  const [checked, setChecked] = useState(false);
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
    onConfirm(value);
  };

  return (
    <Paper className="sdao-card confirm-dialog">
      <Box className="dialog-container" display="flex" alignItems="center" justifyContent="space-between">
        {/* <Typography variant="body2"> */}
        <Grid component="label" container alignItems="center" spacing={1} wrap="nowrap">
          <Grid item>SSDAO</Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
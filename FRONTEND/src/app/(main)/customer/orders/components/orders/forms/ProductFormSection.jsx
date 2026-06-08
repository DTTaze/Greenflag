import { Grid, Paper } from "@mui/material";
import React from "react";

import HeavyProductForm from "./HeavyProductForm";
import LightProductForm from "./LightProductForm";

const ProductFormSection = ({
  newOrder,
  updateOrder,
  servicePackage,
  setProductListDialogOpen,
}) => {
  return (
    <Grid item xs={12}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          bgcolor: "white",
        }}
      >
        {servicePackage === "light" ? (
          <LightProductForm
            newOrder={newOrder}
            updateOrder={updateOrder}
            setProductListDialogOpen={setProductListDialogOpen}
          />
        ) : (
          <HeavyProductForm newOrder={newOrder} updateOrder={updateOrder} />
        )}
      </Paper>
    </Grid>
  );
};

export default ProductFormSection;

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React from "react";

export default function MultiImageUpload({
  previewImages,
  onImageChange,
  onRemoveImage,
  maxImages = 5,
}) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }
    onImageChange(files);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Images (up to {maxImages})
      </Typography>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        Upload Images
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
      <Grid container spacing={2}>
        {previewImages.map((url, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                position: "relative",
                width: 100,
                height: 100,
              }}
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <IconButton
                size="small"
                onClick={() => onRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

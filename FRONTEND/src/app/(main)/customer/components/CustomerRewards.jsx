import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";

import { AuthContext } from "@/src/contexts/auth.context";
import getAmount from "@/src/utils/getAmount";

// Mock data for rewards
const mockRewards = [
  {
    id: 1,
    title: "10% Discount Voucher",
    description: "Get 10% off on your next recycling order",
    coinsRequired: 500,
  },
  {
    id: 2,
    title: "Free Collection",
    description: "One free collection service",
    coinsRequired: 1000,
  },
  {
    id: 3,
    title: "Premium Member Status",
    description: "Unlock premium benefits for one month",
    coinsRequired: 2000,
  },
];

export default function CustomerRewards() {
  const { auth } = useContext(AuthContext);
  const userInfo = auth.user;
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Your Eco Coins
        </Typography>
        <Paper className="customer-card" sx={{ p: 3 }}>
          <Typography variant="h3" gutterBottom>
            {getAmount(userInfo.coins)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Available Eco Coins
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress to next tier
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(getAmount(userInfo.coins) % 1000) / 10}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Paper>
      </Box>

      <Typography variant="h5" component="h2" gutterBottom>
        Available Rewards
      </Typography>
      <Grid container spacing={3}>
        {mockRewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Card className="customer-card">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {reward.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {reward.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {reward.coinsRequired} Eco Coins
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  disabled={getAmount(userInfo.coins) < reward.coinsRequired}
                  onClick={() => console.log("Redeem reward", reward.id)}
                >
                  Redeem
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

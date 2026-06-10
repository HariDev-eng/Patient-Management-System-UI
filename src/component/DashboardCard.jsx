import { Card, CardContent, Typography } from "@mui/material";

export default function DashboardCard({
                                          title,
                                          value,
                                      }) {
    return (
        <Card elevation={3}>
            <CardContent>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    {title}
                </Typography>

                <Typography variant="h4">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}
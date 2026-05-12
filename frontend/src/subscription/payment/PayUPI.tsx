import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PayUPIProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    planName: string;
    planPrice: string;
}

export default function PayUPI({ open, onClose, onBack, planName, planPrice }: PayUPIProps) {
    const [step, setStep] = useState<"details" | "payment">("details");

    const handleBack = () => {
        setStep("details");
        onBack();
    };

    const handleClose = () => {
        setStep("details");
        onClose();
    };

    if (step === "payment") {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ sx: { width: 438, borderRadius: "16px" } }}
            >
                <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2 }}>
                        <Typography fontWeight={600}>Fintree Pay</Typography>
                        <IconButton size="small" onClick={handleClose}>✕</IconButton>
                    </Stack>

                    <Box sx={{ px: 2.5, pb: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box>
                                <Typography fontWeight={600}>{planName}</Typography>
                                <Typography fontSize={13} color="#5f6368">Fintree One</Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" mt={2}>
                            <Typography fontSize={14}>Starting today</Typography>
                            <Typography fontSize={14} fontWeight={600}>{planPrice}</Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ borderTop: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0", px: 2.5, py: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Typography>UPI: QR code</Typography>
                            </Stack>
                            <Typography>›</Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ p: 2.5 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ borderRadius: "24px", textTransform: "none" }}
                        >
                            Subscribe
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 398,
                    maxWidth: 398,
                    borderRadius: "12px",
                    boxShadow: "0px 8px 32px rgba(0,0,0,0.22)",
                },
            }}
        >
            <Box sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconButton size="small" onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography fontSize={16} fontWeight={500}>
                        Pay with UPI
                    </Typography>
                </Stack>

                <Typography fontSize={12} color="#5f6368" mt={3} mb={3}>
                    Enter your UPI ID to proceed with payment
                </Typography>

                <TextField
                    fullWidth
                    label="UPI ID"
                    size="small"
                    placeholder="yourname@upi"
                />

                <Typography fontSize={11} color="#5f6368" mt={4} lineHeight={1.4}>
                    By continuing, you agree to the Fintree Payments Terms of Service.
                </Typography>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    mb={3}
                >
                    <Typography fontSize={14} fontWeight={500}>
                        {planName}
                    </Typography>
                    <Typography fontSize={14}>{planPrice}</Typography>
                </Stack>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setStep("payment")}
                    sx={{
                        borderRadius: "24px",
                        textTransform: "none",
                        height: 44,
                    }}
                >
                    Save and continue
                </Button>
            </Box>
        </Dialog>
    );
}

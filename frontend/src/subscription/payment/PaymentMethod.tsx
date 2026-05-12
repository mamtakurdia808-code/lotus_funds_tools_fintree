import React, { useState, useEffect } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PayCard from "./PayCard";
import PayUPI from "./PayUPI";
import PayRedeem from "./PayReedem";

type ActiveView = "main" | "card" | "upi" | "redeem" | "phone";

interface PaymentItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onClick?: () => void;
}

const PaymentItem: React.FC<PaymentItemProps> = ({
    icon,
    title,
    subtitle,
    onClick,
}) => {
    return (
        <Stack
            direction="row"
            spacing={2.5}
            alignItems="flex-start"
            onClick={onClick}
            sx={{
                py: 1.4,
                cursor: "pointer",
            }}
        >
            <Box
                sx={{
                    color: "#3c4043",
                    display: "flex",
                    alignItems: "center",
                    mt: 0.2,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    sx={{
                        fontSize: "16px",
                        color: "#202124",
                        fontWeight: 400,
                    }}
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        sx={{
                            mt: 0.3,
                            fontSize: "13px",
                            lineHeight: 1.35,
                            color: "#5f6368",
                            maxWidth: "420px",
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
};

interface PaymentMethodProps {
    open: boolean;
    onClose: () => void;
    planName: string;
    planPrice: string;
}

export default function PaymentMethod({ open, onClose, planName, planPrice }: PaymentMethodProps) {
    const [activeView, setActiveView] = useState<ActiveView>("main");

    // Reset to main view whenever the dialog opens
    useEffect(() => {
        if (open) {
            setActiveView("main");
        }
    }, [open]);

    const handleClose = () => {
        setActiveView("main");
        onClose();
    };

    const handleBack = () => {
        setActiveView("main");
    };

    return (
        <>
            {/* Main Payment Method Dialog */}
            <Dialog
                open={open && activeView === "main"}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: "589px",
                        maxWidth: "589px",
                        borderRadius: "20px",
                        boxShadow:
                            "0px 2px 8px rgba(0,0,0,0.15), 0px 8px 24px rgba(0,0,0,0.12)",
                        overflow: "hidden",
                    },
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "30px",
                            fontWeight: 500,
                            color: "#5f6368",
                            letterSpacing: "-0.4px",
                        }}
                    >
                        FintreePay
                    </Typography>

                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon sx={{ color: "#5f6368", fontSize: 28 }} />
                    </IconButton>
                </Box>

                <Divider />

                <DialogContent
                    sx={{
                        px: 3,
                        py: 2.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "#202124",
                        }}
                    >
                        Start by adding a payment method
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#5f6368",
                            mt: 0.4,
                        }}
                    >
                        name@gmail.com
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            lineHeight: 1.45,
                            color: "#5f6368",
                            mt: 2.2,
                            mb: 3,
                        }}
                    >
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure cumque commodi dolorum incidunt saepe fuga? Ipsum harum voluptate, quia deleniti veniam quas non corporis adipisci amet sed similique. Similique, hic.
                    </Typography>

                    <Stack spacing={0.5}>
                        <PaymentItem
                            icon={<CreditCardOutlinedIcon />}
                            title="Add card"
                            onClick={() => setActiveView("card")}
                        />

                        <PaymentItem
                            icon={<AccountBalanceWalletOutlinedIcon />}
                            title="Pay with UPI"
                            onClick={() => setActiveView("upi")}
                        />

                        <PaymentItem
                            icon={<ConfirmationNumberOutlinedIcon />}
                            title="Redeem code"
                            onClick={() => setActiveView("redeem")}
                        />

                        {/* <PaymentItem
                            icon={<SmartphoneOutlinedIcon />}
                            title="Pay on your phone"
                            subtitle="More payment options available. A notification will be sent to all your devices."
                            onClick={() => setActiveView("phone")}
                        /> */}
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Sub-dialogs */}
            <PayCard
                open={open && activeView === "card"}
                onClose={handleClose}
                onBack={handleBack}
                planName={planName}
                planPrice={planPrice}
            />
            <PayUPI
                open={open && activeView === "upi"}
                onClose={handleClose}
                onBack={handleBack}
                planName={planName}
                planPrice={planPrice}
            />
            <PayRedeem
                open={open && activeView === "redeem"}
                onClose={handleClose}
                onBack={handleBack}
            />
        </>
    );
}

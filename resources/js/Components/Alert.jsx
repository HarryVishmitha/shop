import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import '../../css/app.css';

// Alert component
const Alert = ({ type, message, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) {
                onClose();
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setVisible(false);
        if (onClose) {
            onClose();
        }
    };

    // Define alert styles and icons based on type
    const alertConfig = {
        primary: {
            className: "alert-primary bg-primary-50 text-primary-600 border-primary-600",
            icon: "mingcute:emoji-line",
        },
        lilac: {
            className: "alert-lilac bg-lilac-50 text-lilac-600 border-lilac-600",
            icon: "mingcute:emoji-line",
        },
        success: {
            className: "alert-success bg-success-100 text-success-600 border-success-600",
            icon: "akar-icons:double-check",
        },
        warning: {
            className: "alert-warning bg-warning-100 text-warning-600 border-warning-600",
            icon: "mdi:alert-circle-outline",
        },
        info: {
            className: "alert-info bg-info-100 text-info-600 border-info-600",
            icon: "ci:link",
        },
        danger: {
            className: "alert-danger bg-danger-100 text-danger-600 border-danger-600",
            icon: "mingcute:delete-2-line",
        },
    };

    const { className, icon } = alertConfig[type] || alertConfig.primary;

    return (
        <div
            className={`alert ${className} border-start-width-4-px border-top-0 border-end-0 border-bottom-0 px-24 py-13 mb-0 text-md radius-4 d-flex align-items-center justify-content-between
            ${visible ? 'alert-enter alert-enter-active' : 'alert-exit alert-exit-active'}`}
            role="alert"
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
        >
            <div className="d-flex align-items-center gap-2">
                <Icon icon={icon} className="icon text-xl" />
                {message || `This is a ${type} alert`}
            </div>
            <button className="remove-button text-xxl line-height-1" onClick={handleClose}>
                <Icon icon="iconamoon:sign-times-light" className="icon" />
            </button>
        </div>
    );
};

export default Alert;

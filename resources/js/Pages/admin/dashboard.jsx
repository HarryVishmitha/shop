import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';

const Dashboard = () => {
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminHeader>
                <h2 className="tw-text-2xl tw-font-bold">Dashboard</h2>
                <p>Welcome to the admin dashboard. Here's an overview of youdgefghfhr stats.</p>
                {/* Add more content related to Dashboard */}
            </AdminHeader>
            <CookiesV />
        </>
    );
};

export default Dashboard;

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
// import AdminHeader from '../../Components/AdminHeader';
// import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";

const Dashboard = ({ totalUsers, adminUsers, userUsers, workingGroups, dailyCustomers, userDetails}) => {
    const breadcrumbs = [
        { label: 'Home', url: route('home'), icon: 'fluent:home-48-regular' },
        { label: 'Admin Dashboard', url: '', icon: null },
    ];
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminDashboard>
                <Breadcrumb title="Panels" />
                hi
            </AdminDashboard>
            <CookiesV />
        </>
    );
};

export default Dashboard;

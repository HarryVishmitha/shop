import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";

const Users = ({ users }) => {
    const breadcrumbs = [
        { label: 'Home', url: route('home'), icon: 'fluent:home-48-regular' },
        { label: 'Admin Dashboard', url: route('admin.dashboard'), icon: null },
        { label: 'Users', url: '', icon: null },
    ];
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminHeader>
            <AdminNav breadcrumbs={breadcrumbs} />
                <div className="container-fluid tw-mt-3">
                    <div className="row">
                        
                    </div>
                </div>
            </AdminHeader>
            <CookiesV />
        </>
    );
};

export default Users;

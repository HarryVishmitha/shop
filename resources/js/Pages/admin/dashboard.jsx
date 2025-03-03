import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";

const Dashboard = ({ totalUsers, }) => {
    const breadcrumbs = [
        { label: 'Home', url: route('home'), icon: 'fluent:home-48-regular' },
        { label: 'Admin Dashboard', url: route('admin.dashboard'), icon: null },
    ];
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminHeader>
            <AdminNav breadcrumbs={breadcrumbs} />
            <div className="container-fluid tw-mt-3">
                <div className="row">
                    <div className="col-sm-2 tw-bg-white tw-rounded tw-shadow-sm tw-p-2">
                        <div className="tw-border-2 tw-border-indigo-600 w-100 tw-rounded-lg tw-p-4" style={{ background: 'linear-gradient(to right, rgb(195 227 255), rgb(210 253 255))' }}>
                            <div className="d-flex tw-items-center">
                                <Icon icon='gridicons:multiple-users' className='tw-bg-blue-500 tw-w-16 tw-h-16 tw-p-3 tw-rounded-full tw-text-white tw-me-3'/>
                                <div className="flex">
                                    <div className="tw-font-medium">
                                        Total Users :
                                    </div>
                                    <div className="tw-font-bold tw-text-3xl">
                                        {totalUsers}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </AdminHeader>
            <CookiesV />
        </>
    );
};

export default Dashboard;

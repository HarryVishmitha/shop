import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";

const Dashboard = ({ totalUsers, adminUsers, userUsers, workingGroups, dailyCustomers}) => {
    const breadcrumbs = [
        { label: 'Home', url: route('home'), icon: 'fluent:home-48-regular' },
        { label: 'Admin Dashboard', url: '', icon: null },
    ];
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminHeader>
            <AdminNav breadcrumbs={breadcrumbs} />
            <div className="container-fluid tw-mt-3">
                <div className="row">
                    {/* Total Users */}
                    <div className="col-sm-2 tw-bg-white tw-rounded tw-shadow-sm tw-p-2">
                        <div className="tw-border-2 tw-border-indigo-600 w-100 tw-rounded-lg tw-p-4 tw-h-full" style={{ background: 'linear-gradient(to right, rgb(195 227 255), rgb(210 253 255))' }}>
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
                    {/* Admin Users */}
                    <div className="col-sm-2 tw-bg-white tw-rounded tw-shadow-sm tw-p-2 tw-ms-3">
                        <div className="tw-border-2 tw-border-indigo-600 w-100 tw-rounded-lg tw-p-4 tw-h-full" style={{ background: 'linear-gradient(to right, rgb(195 227 255), rgb(210 253 255))' }}>
                            <div className="d-flex tw-items-center">
                                <Icon icon='clarity:administrator-line' className='tw-bg-blue-500 tw-w-16 tw-h-16 tw-p-3 tw-rounded-full tw-text-white tw-me-3'/>
                                <div className="flex">
                                    <div className="tw-font-medium">
                                        Admin Users :
                                    </div>
                                    <div className="tw-font-bold tw-text-3xl">
                                        {adminUsers}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Users */}
                    <div className="col-sm-2 tw-bg-white tw-rounded tw-shadow-sm tw-p-2 tw-ms-3">
                        <div className="tw-border-2 tw-border-indigo-600 w-100 tw-rounded-lg tw-p-4 tw-h-full" style={{ background: 'linear-gradient(to right, rgb(195 227 255), rgb(210 253 255))' }}>
                            <div className="d-flex tw-items-center">
                                <Icon icon='majesticons:user-line' className='tw-bg-blue-500 tw-w-16 tw-h-16 tw-p-3 tw-rounded-full tw-text-white tw-me-3'/>
                                <div className="flex">
                                    <div className="tw-font-medium">
                                        Systemic Users :
                                    </div>
                                    <div className="tw-font-bold tw-text-3xl">
                                        {userUsers}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Working Groups */}
                    <div className="col-sm-2 tw-bg-white tw-rounded tw-shadow-sm tw-p-2 tw-ms-3">
                        <div className="tw-border-2 tw-border-indigo-600 w-100 tw-rounded-lg tw-p-4 tw-h-full" style={{ background: 'linear-gradient(to right, rgb(195 227 255), rgb(210 253 255))' }}>
                            <div className="d-flex tw-items-center">
                                <Icon icon='dashicons:networking' className='tw-bg-blue-500 tw-w-16 tw-h-16 tw-p-3 tw-rounded-full tw-text-white tw-me-3'/>
                                <div className="flex">
                                    <div className="tw-font-medium">
                                        Working Groups :
                                    </div>
                                    <div className="tw-font-bold tw-text-3xl">
                                        {workingGroups}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Daily customers */}
                    <div className="col-sm-2 tw-bg-white tw-rounded tw-shadow-sm tw-p-2 tw-ms-3">
                        <div className="tw-border-2 tw-border-indigo-600 w-100 tw-rounded-lg tw-p-4 tw-h-full" style={{ background: 'linear-gradient(to right, rgb(195 227 255), rgb(210 253 255))' }}>
                            <div className="d-flex tw-items-center">
                                <Icon icon='carbon:customer' className='tw-bg-blue-500 tw-w-16 tw-h-16 tw-p-3 tw-rounded-full tw-text-white tw-me-3'/>
                                <div className="flex">
                                    <div className="tw-font-medium">
                                        Daily Customers:
                                    </div>
                                    <div className="tw-font-bold tw-text-3xl">
                                        {dailyCustomers}
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

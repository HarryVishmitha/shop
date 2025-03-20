import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";

const useredit = ({ userDetails }) => {

    return(
        <>
            <Head title="Edit - Admin" />
            <AdminDashboard userDetails={userDetails}>
                <Breadcrumb title="Edit User" />

            </AdminDashboard>
        </>
    );
};

export default useredit;
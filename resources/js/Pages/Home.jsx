import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../components/Header';
import CookieConsent from '@/Components/CookieConsent';


const Home = () => {
    return (
        <>
            <Head title="Home" />
            <Header />
            <CookieConsent>
                <div className="tw-bg-blue-500" style={{ height: '900px' }}>
                    hi
                </div>
            </CookieConsent>
        </>
    );
};

export default Home;

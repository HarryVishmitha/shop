import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../components/Header';


const Home = () => {
    return (
        <>
            <Head title="Home" />
            <Header />
            <div className="tw-bg-blue-500" style={{ height: '900px' }}>
                hi
            </div>
        </>
    );
};

export default Home;

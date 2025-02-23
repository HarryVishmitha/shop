import React from 'react';

const Header = () => {
    return (
        <header className="tw-bg-white tw-shadow-md tw-py-4">
            <div className="tw-container tw-mx-auto tw-flex tw-justify-between tw-items-center tw-px-3 tw-pb-4">
                {/* Right Side */}
                <a href="/">
                    <div className="tw-flex tw-items-center tw-space-x-2">
                        <img src="/images/favicon.png" alt="Logo" className="tw-w-10 tw-h-10" />
                        <span className="tw-font-bold tw-text-[27px]">Printair</span>
                    </div>
                </a>

                {/* Left Side */}
                <div className="tw-flex tw-items-center tw-space-x-5">
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032] tw-text-[17px]">
                        <i className="fa-solid fa-file-pen"></i> Ask For Quote
                    </a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032] tw-text-[17px] tw-relative tw-text-md">
                        <span className="tw-absolute tw-w-5 tw-h-5 tw-text-center tw-align-middle tw-p-1 tw-text-xs tw-bg-red-500 tw-rounded-full tw--right-3 tw--top-3.5 tw-text-white tw-leading">5</span>
                        <i className="fa-solid fa-cart-shopping"></i> Cart
                    </a>
                    <a href={route('login')} className="tw-text-gray-400 hover:tw-text-[#f44032] tw-text-[17px]">
                        <i className="fas fa-user"></i> Login
                    </a>
                </div>
            </div>
            <hr />
            <div className="tw-container tw-mx-auto tw-flex tw-justify-center tw-items-center tw-px-6 tw-pt-3">
                {/* Navigation Links */}
                <div className="tw-hidden md:tw-flex tw-space-x-6 tw-text-sm">
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">All Products</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Business Stationery</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Marketing Materials</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Large Format</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Promotional</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Photo Products</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Labels & Stickers</a>
                    <a href="#" className="tw-text-gray-400 hover:tw-text-[#f44032]">Booklet & Copies</a>
                </div>
            </div>
        </header>

    );
};

export default Header;

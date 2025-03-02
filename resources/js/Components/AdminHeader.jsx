import React, { Children } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import Cookies from 'js-cookie';

const AdminHeader = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State for collapsing sidebar
  const [offcanvasOpen, setOffcanvasOpen] = useState(false); // State for offcanvas menu

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Set the state in the cookie
    Cookies.set('sidebarState', !sidebarCollapsed ? 'collapsed' : 'expanded', { expires: 365 });
  };

  // Toggle offcanvas sidebar for small screens
  const toggleOffcanvas = () => {
    setOffcanvasOpen(!offcanvasOpen);
  };

  // Set the initial state of the sidebar based on the cookie value
  useEffect(() => {
    const storedSidebarState = Cookies.get('sidebarState');
    if (storedSidebarState === 'collapsed') {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, []);
    return (
<div className="tw-flex tw-h-screen">
      {/* Sidebar for medium and larger screens */}
      <div
        className={`tw-bg-gray-800 tw-text-white ${sidebarCollapsed ? 'tw-w-20' : 'tw-w-64'} tw-transition-all tw-hidden md:tw-block tw-border-r-2`}
      >
        <div className="tw-p-4 tw-flex tw-items-center tw-justify-center">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="tw-h-10 tw-hidden md:tw-block"
          />
          {!sidebarCollapsed && <span className="tw-text-xl tw-font-semibold tw-ms-1">Printair</span>}
        </div>
        <hr className='tw-border-t-2 tw-border-gray-400' />
        <div className="tw-px-4">
          <div className="tw-py-3 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon icon="bi:house-door" className="tw-text-2xl tw-mr-4" />
              {!sidebarCollapsed && <span className="tw-text-sm">Dashboard</span>}
            </div>
          </div>

          <div className="tw-py-3 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon icon="bi:person" className="tw-text-2xl tw-mr-4" />
              {!sidebarCollapsed && <span className="tw-text-sm">Users</span>}
            </div>
          </div>

          <div className="tw-py-3 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon icon="bi:gear" className="tw-text-2xl tw-mr-4" />
              {!sidebarCollapsed && <span className="tw-text-sm">Settings</span>}
            </div>
          </div>
        </div>

        {/* Arrow icon to collapse/expand the sidebar */}
        {/* <div className="tw-absolute tw-bottom-4 tw-left-1/2 tw-transform tw-translate-x-[-50%]">
          <button onClick={toggleSidebar} className="tw-bg-gray-700 tw-p-2 tw-rounded-full tw-text-white">
            <Icon icon={sidebarCollapsed ? "bi:arrow-right-circle" : "bi:arrow-left-circle"} />
          </button>
        </div> */}
      </div>

      {/* Offcanvas Sidebar for small screens */}
      <div
        className={`md:tw-hidden tw-fixed tw-inset-0 tw-bg-black tw-opacity-50 ${
          offcanvasOpen ? 'tw-block' : 'tw-hidden'
        }`}
        onClick={toggleOffcanvas}
      ></div>

      <div
        className={`md:tw-hidden tw-fixed tw-top-0 tw-left-0 tw-bg-gray-800 tw-text-white tw-w-64 tw-h-full tw-transition-transform ${
          offcanvasOpen ? 'tw-transform-none' : 'tw-transform -tw-translate-x-full'
        }`}
      >
        <div className="tw-p-4 tw-flex tw-items-center tw-justify-center">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="tw-h-10 md:tw-hidden"
          />
          {offcanvasOpen && <span className="tw-text-xl tw-font-semibold tw-ms-1">Printair</span>}
        </div>

        <div className="tw-px-4">
          <div className="tw-py-3 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon icon="bi:house-door" className="tw-text-2xl tw-mr-4" />
              <span className="tw-text-sm">Dashboard</span>
            </div>
          </div>

          <div className="tw-py-3 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon icon="bi:person" className="tw-text-2xl tw-mr-4" />
              <span className="tw-text-sm">Users</span>
            </div>
          </div>

          <div className="tw-py-3 tw-cursor-pointer">
            <div className="tw-flex tw-items-center">
              <Icon icon="bi:gear" className="tw-text-2xl tw-mr-4" />
              <span className="tw-text-sm">Settings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="tw-flex-1 tw-bg-gray-100 tw-flex tw-flex-col">
        {/* Top Navbar */}
        <div className="tw-flex tw-items-center tw-justify-between tw-bg-red-600 tw-px-4 tw-py-4 tw-text-white">
          <div className="tw-flex tw-items-center">
            {/* Hamburger Menu Button (visible only on small screens) */}
            <button
              className="md:tw-hidden tw-px-3 tw-py-2 tw-bg-gray-700 tw-rounded tw-text-white"
              onClick={toggleOffcanvas}
            >
              <Icon icon="bi:list" />
            </button>
            <button onClick={toggleSidebar} className=" tw-p-2 tw-text-white tw-hidden md:tw-block">
                <Icon icon={sidebarCollapsed ? "heroicons-solid:menu-alt-2" : "heroicons-solid:menu-alt-1"} width="25" height='25' />
            </button>
            <span className="tw-ml-4 tw-text-xl">Admin Panel</span>
          </div>
          <div className="tw-flex tw-items-center">
            <button className="tw-ml-4 tw-px-1 tw-py-1 tw-rounded-full tw-text-white">
              <Icon icon="mdi:bell-outline" width={30} height={30} />
            </button>
            <div class="dropdown">
                <button className="tw-ml-4 tw-bg-gray-300 tw-px-1 tw-py-1 tw-rounded-full tw-text-black dropdown-toggle no-dropdown-triangle" data-bs-toggle="dropdown" aria-expanded="false">
                    <Icon icon="humbleicons:user" width={30} height={30} />
                </button>
                <ul class="dropdown-menu">
                    <li><Link href={route('profile.edit')} className='dropdown-item'>Profile</Link></li>
                    <li><Link href={route('logout')} method="post" as="button" className='dropdown-item'>Log out</Link></li>
                </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="tw-flex-1 tw-bg-white tw-p-6 tw-m-4 tw-rounded-xl">
          {children}
        </div>
      </div>
    </div>
    );

};
export default AdminHeader;

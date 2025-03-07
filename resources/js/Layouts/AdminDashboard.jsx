import { Head, Link } from '@inertiajs/react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from 'react';
import { useLocation, NavLink } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import Cookies from 'js-cookie';
import 'bootstrap/dist/js/bootstrap.bundle';

const AdminDashboard = ({ children, userDetails }) => {
    let [sidebarActive, seSidebarActive] = useState(false);
    let [mobileMenu, setMobileMenu] = useState(false);
    const location = useLocation(); // Hook to get the current route
    const currentYear = new Date().getFullYear(); // Get the current year
    const [theme, setTheme] = useState('light'); // Initialize theme state

    useEffect(() => {

        const themeFromCookie = Cookies.get('theme');
        const sidebarstatus = Cookies.get('sidebarActive');
        if (mobileMenu) {
            seSidebarActive(false); // Close the sidebar when mobile menu is open
            Cookies.set('sidebarActive', 'inactive', { expires: 365 }); // Update cookie accordingly
        } else {
            // When mobile menu is not open, maintain sidebar state
            const sidebarstatus = Cookies.get('sidebarActive');
            if (sidebarstatus === 'active') {
                seSidebarActive(true);
            } else {
                seSidebarActive(false);
            }
        }
        if (themeFromCookie) {
            setTheme(themeFromCookie); // Update state from cookie
        } else {
            // Fallback to localStorage if cookie is not set
            const storedTheme = localStorage.getItem('theme') || 'light';
            setTheme(storedTheme);
        }

        // Apply the theme on the HTML element
        const updateThemeOnHtmlEl = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');

            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateThemeOnHtmlEl(themeFromCookie); // Update the theme on page load

        const handleDropdownClick = (event) => {
        event.preventDefault();
        const clickedLink = event.currentTarget;
        const clickedDropdown = clickedLink.closest(".dropdown");

        if (!clickedDropdown) return;

        const isActive = clickedDropdown.classList.contains("open");

        // Close all dropdowns
        const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
        allDropdowns.forEach((dropdown) => {
          dropdown.classList.remove("open");
          const submenu = dropdown.querySelector(".sidebar-submenu");
          if (submenu) {
            submenu.style.maxHeight = "0px"; // Collapse submenu
          }
        });

        // Toggle the clicked dropdown
        if (!isActive) {
          clickedDropdown.classList.add("open");
          const submenu = clickedDropdown.querySelector(".sidebar-submenu");
          if (submenu) {
            submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
          }
        }
      };

      // Attach click event listeners to all dropdown triggers
      const dropdownTriggers = document.querySelectorAll(
        ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
      );

      dropdownTriggers.forEach((trigger) => {
        trigger.addEventListener("click", handleDropdownClick);
      });

      const openActiveDropdown = () => {
        const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
        allDropdowns.forEach((dropdown) => {
          const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
          submenuLinks.forEach((link) => {
            if (
              link.getAttribute("href") === location.pathname ||
              link.getAttribute("to") === location.pathname
            ) {
              dropdown.classList.add("open");
              const submenu = dropdown.querySelector(".sidebar-submenu");
              if (submenu) {
                submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
              }
            }
          });
        });
      };

      // Open the submenu that contains the active route
      openActiveDropdown();

      // Cleanup event listeners on unmount
      return () => {
        dropdownTriggers.forEach((trigger) => {
          trigger.removeEventListener("click", handleDropdownClick);
        });
      };
    }, [location.pathname], [mobileMenu]);

    let sidebarControl = () => {
        if (mobileMenu) {
            setMobileMenu(false);  // Close mobile menu when toggling sidebar
        }
      seSidebarActive(!sidebarActive);
      handleSidebarToggle();
    };

    const handleSidebarToggle = () => {
        // Toggle the sidebar state and update the cookie
        const newSidebarState = !sidebarActive;
        seSidebarActive(newSidebarState);
        Cookies.set('sidebarActive', newSidebarState ? 'active' : 'inactive', { expires: 365 });
    };

    let mobileMenuControl = () => {

      setMobileMenu(!mobileMenu);
    };

    useEffect(() => {
        if (mobileMenu && sidebarActive) {
            seSidebarActive(false);
            Cookies.set('sidebarActive', 'inactive', { expires: 365 });
        }
    }, [mobileMenu]);

    return (
        <>
            <section className={mobileMenu ? "overlay active" : "overlay "}>
            {/* sidebar */}
            <aside
                className={
                sidebarActive
                    ? "sidebar active "
                    : mobileMenu
                    ? "sidebar sidebar-open"
                    : "sidebar"
                }
            >
                <button
                onClick={mobileMenuControl}
                type='button'
                className='sidebar-close-btn'
                >
                <Icon icon='radix-icons:cross-2' />
                </button>
                {/* LOGO section */}
                <div>
                    <Link href='/' className='sidebar-logo'>
                        <img
                        src='/assets/images/logo.png'
                        alt='site logo'
                        className='light-logo'
                        />
                        <img
                        src='/assets/images/logo-light.png'
                        alt='site logo'
                        className='dark-logo'
                        />
                        <img
                        src='/assets/images/logo-icon.png'
                        alt='site logo'
                        className='logo-icon'
                        />
                    </Link>
                </div>
                {/* End LOGO section */}
                <div className='sidebar-menu-area'>
                    {/* sidebar start */}
                    <ul className='sidebar-menu' id='sidebar-menu'>
                        <li className='mb-3'>
                            <Link
                                href={ route("admin.dashboard") }
                                className={(navData) => (navData.isActive ? "active-page" : "")}
                            >
                                <Icon
                                icon='solar:home-smile-angle-outline'
                                className='menu-icon'
                                />
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <li className='sidebar-menu-group-title'>User Management</li>
                        {/* Users Dropdown */}
                        <li className='dropdown'>
                            <Link href={route('admin.users')}>
                                <Icon
                                icon='flowbite:users-group-outline'
                                className='menu-icon'
                                />
                                <span>Users</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                <Link
                                    href={route('admin.users')}
                                    className={(navData) =>
                                    navData.isActive ? "active-page" : ""
                                    }
                                >
                                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                    All Users
                                </Link>
                                </li>
                                <li>
                                <Link
                                    to='/users-grid'
                                    className={(navData) =>
                                    navData.isActive ? "active-page" : ""
                                    }
                                >
                                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                                    Users Grid
                                </Link>
                                </li>
                                <li>
                                <Link
                                    to='/add-user'
                                    className={(navData) =>
                                    navData.isActive ? "active-page" : ""
                                    }
                                >
                                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                                    Add User
                                </Link>
                                </li>
                                <li>
                                <Link
                                    to='/view-profile'
                                    className={(navData) =>
                                    navData.isActive ? "active-page" : ""
                                    }
                                >
                                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                                    View Profile
                                </Link>
                                </li>
                            </ul>
                        </li>

                        {/* Role & Access Dropdown */}
                        <li className='dropdown'>
                            <Link href={route('admin.users')}>
                                <i className='ri-user-settings-line' />
                                <span>Role &amp; Access</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                <Link
                                    to='/role-access'
                                    className={(navData) =>
                                    navData.isActive ? "active-page" : ""
                                    }
                                >
                                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                    Role &amp; Access
                                </Link>
                                </li>
                                <li>
                                <Link
                                    to='/assign-role'
                                    className={(navData) =>
                                    navData.isActive ? "active-page" : ""
                                    }
                                >
                                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                                    Assign Role
                                </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
              <Link
                href='/testimonials'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon='mage:message-question-mark-round'
                  className='menu-icon'
                />
                <span>Testimonials</span>
              </Link>
            </li>
                    </ul>
                </div>
            </aside>

            <main
                className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
            >
                <div className='navbar-header'>
                <div className='row align-items-center justify-content-between'>
                    <div className='col-auto'>
                    <div className='d-flex flex-wrap align-items-center gap-4'>
                        <button
                        type='button'
                        className='sidebar-toggle'
                        onClick={sidebarControl}
                        >
                        {sidebarActive ? (
                            <Icon
                            icon='iconoir:arrow-right'
                            className='icon text-2xl non-active'
                            />
                        ) : (
                            <Icon
                            icon='heroicons:bars-3-solid'
                            className='icon text-2xl non-active '
                            />
                        )}
                        </button>
                        <button
                        onClick={mobileMenuControl}
                        type='button'
                        className='sidebar-mobile-toggle'
                        >
                        <Icon icon='heroicons:bars-3-solid' className='icon' />
                        </button>
                        <form className='navbar-search'>
                        <input type='text' name='search' placeholder='Search' />
                        <Icon icon='ion:search-outline' className='icon' />
                        </form>
                    </div>
                    </div>
                    <div className='col-auto'>
                    <div className='d-flex flex-wrap align-items-center gap-3'>
                        {/* ThemeToggleButton */}
                        <ThemeToggleButton />

                        <div className='dropdown'>
                        <button
                            className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                            type='button'
                            data-bs-toggle='dropdown'
                        >
                            <Icon
                            icon='mage:email'
                            className='text-primary-light text-xl'
                            />
                        </button>
                        <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                            <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                            <div>
                                <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                                Message
                                </h6>
                            </div>
                            <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                                05
                            </span>
                            </div>
                            <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                                    <img
                                    src='/assets/images/notification/profile-3.png'
                                    alt=''
                                    />
                                    <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Kathryn Murphy
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                                    hey! there i’m...
                                    </p>
                                </div>
                                </div>
                                <div className='d-flex flex-column align-items-end'>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                    12:30 PM
                                </span>
                                <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                                    8
                                </span>
                                </div>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                                    <img
                                    src='/assets/images/notification/profile-4.png'
                                    alt=''
                                    />
                                    <span className='w-8-px h-8-px  bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Kathryn Murphy
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                                    hey! there i’m...
                                    </p>
                                </div>
                                </div>
                                <div className='d-flex flex-column align-items-end'>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                    12:30 PM
                                </span>
                                <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                                    2
                                </span>
                                </div>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                                    <img
                                    src='/assets/images/notification/profile-5.png'
                                    alt=''
                                    />
                                    <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Kathryn Murphy
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                                    hey! there i’m...
                                    </p>
                                </div>
                                </div>
                                <div className='d-flex flex-column align-items-end'>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                    12:30 PM
                                </span>
                                <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle'>
                                    0
                                </span>
                                </div>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                                    <img
                                    src='/assets/images/notification/profile-6.png'
                                    alt=''
                                    />
                                    <span className='w-8-px h-8-px bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Kathryn Murphy
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                                    hey! there i’m...
                                    </p>
                                </div>
                                </div>
                                <div className='d-flex flex-column align-items-end'>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                    12:30 PM
                                </span>
                                <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle'>
                                    0
                                </span>
                                </div>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                                    <img
                                    src='/assets/images/notification/profile-7.png'
                                    alt=''
                                    />
                                    <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Kathryn Murphy
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                                    hey! there i’m...
                                    </p>
                                </div>
                                </div>
                                <div className='d-flex flex-column align-items-end'>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                    12:30 PM
                                </span>
                                <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                                    8
                                </span>
                                </div>
                            </Link>
                            </div>
                            <div className='text-center py-12 px-16'>
                            <Link
                                to='#'
                                className='text-primary-600 fw-semibold text-md'
                            >
                                See All Message
                            </Link>
                            </div>
                        </div>
                        </div>
                        {/* Message dropdown end */}
                        <div className='dropdown'>
                        <button
                            className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                            type='button'
                            data-bs-toggle='dropdown'
                        >
                            <Icon
                            icon='iconoir:bell'
                            className='text-primary-light text-xl'
                            />
                        </button>
                        <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                            <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                            <div>
                                <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                                Notifications
                                </h6>
                            </div>
                            <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                                05
                            </span>
                            </div>
                            <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                    <Icon
                                    icon='bitcoin-icons:verify-outline'
                                    className='icon text-xxl'
                                    />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Congratulations
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                                    Your profile has been Verified. Your profile has
                                    been Verified
                                    </p>
                                </div>
                                </div>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                23 Mins ago
                                </span>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                    <img
                                    src='/assets/images/notification/profile-1.png'
                                    alt=''
                                    />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Ronald Richards
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                                    You can stitch between artboards
                                    </p>
                                </div>
                                </div>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                23 Mins ago
                                </span>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                    AM
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Arlene McCoy
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                                    Invite you to prototyping
                                    </p>
                                </div>
                                </div>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                23 Mins ago
                                </span>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                    <img
                                    src='/assets/images/notification/profile-2.png'
                                    alt=''
                                    />
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Annette Black
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                                    Invite you to prototyping
                                    </p>
                                </div>
                                </div>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                23 Mins ago
                                </span>
                            </Link>
                            <Link
                                to='#'
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                    DR
                                </span>
                                <div>
                                    <h6 className='text-md fw-semibold mb-4'>
                                    Darlene Robertson
                                    </h6>
                                    <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                                    Invite you to prototyping
                                    </p>
                                </div>
                                </div>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                23 Mins ago
                                </span>
                            </Link>
                            </div>
                            <div className='text-center py-12 px-16'>
                            <Link
                                to='#'
                                className='text-primary-600 fw-semibold text-md'
                            >
                                See All Notification
                            </Link>
                            </div>
                        </div>
                        </div>
                        {/* Notification dropdown end */}
                        <div className='dropdown'>
                            <button
                                className='d-flex justify-content-center align-items-center rounded-circle'
                                type='button'
                                data-bs-toggle='dropdown'
                            >
                                <img
                                src='/assets/images/user.png'
                                alt='image_user'
                                className='w-40-px h-40-px object-fit-cover rounded-circle'
                                />
                            </button>
                            <div className='dropdown-menu to-top dropdown-menu-sm'>
                                <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                <div>
                                    <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                                        {userDetails.name}
                                    </h6>
                                    <span className='text-secondary-light fw-medium text-sm'>
                                        {userDetails.email}
                                    </span>
                                    <span className='text-secondary-light fw-medium text-sm tw-capitalize'>
                                        {userDetails.role.name}
                                    </span>
                                </div>
                                <button type='button' className='hover-text-danger'>
                                    <Icon
                                    icon='radix-icons:cross-1'
                                    className='icon text-xl'
                                    />
                                </button>
                                </div>
                                <ul className='to-top-list'>
                                <li>
                                    <Link
                                    className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                    href={route('profile.edit')}
                                    >
                                    <Icon
                                        icon='solar:user-linear'
                                        className='icon text-xl'
                                    />{" "}
                                    My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                    className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    >
                                    <Icon icon='lucide:power' className='icon text-xl' />{" "}
                                    Log Out
                                    </Link>
                                </li>
                                </ul>
                            </div>
                        </div>
                        {/* Profile dropdown end */}
                    </div>
                    </div>
                </div>
                </div>

                {/* dashboard-main-body */}
                <div className='dashboard-main-body'>{children}</div>

                {/* Footer section */}
                <footer className='d-footer text-sm'>
                    <div className='row align-items-center justify-content-between'>
                        <div className='col-auto'>
                        <p className='mb-0'>© { currentYear } Printair. All Rights Reserved.</p>
                        </div>
                        <div className='col-auto'>
                        <p className='mb-0'>
                            Developed by <span className='text-primary-600'>2119</span>
                        </p>
                        </div>
                    </div>
                </footer>
            </main>
            </section>
        </>
    );
};

export default AdminDashboard;

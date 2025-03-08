import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";

const Users = ({ users, userDetails, status: selectedStatus }) => {
    // Get the perPage value from the URL or default to 10
    const queryParams = new URLSearchParams(window.location.search);
    const initialPerPage = queryParams.get('perPage') || 10; // Default to 10 if not set in the URL
    const [perPage, setPerPage] = useState(initialPerPage);
    const [search, setSearch] = useState(''); // State for search input
    const [status, setStatus] = useState(selectedStatus || ''); // State for status filter

    const breadcrumbs = [
        { label: 'Home', url: route('home'), icon: 'fluent:home-48-regular' },
        { label: 'Admin Dashboard', url: route('admin.dashboard'), icon: null },
        { label: 'Users', url: '', icon: null },
    ];

    // Handle per page change
    const handlePerPageChange = (event) => {
        const value = event.target.value;
        setPerPage(value); // Update perPage state
        // Update URL with the new perPage value and reload the page
        window.location.href = `${users.path}?page=${users.current_page}&perPage=${value}&status=${status}`;
    };

    // Handle search change
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        // Optionally, you could implement filtering by search term here.
    };

    // Handle status filter change
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        // Update the URL with the selected status and reload the page
        window.location.href = `${users.path}?page=${users.current_page}&perPage=${perPage}&status=${event.target.value}`;
    };

    useEffect(() => {
        // Sync state with URL in case perPage is changed manually
        const queryParams = new URLSearchParams(window.location.search);
        const pagePerPage = queryParams.get('perPage');
        const pageStatus = queryParams.get('status');
        if (pagePerPage) {
            setPerPage(pagePerPage);
        }
        if (pageStatus) {
            setStatus(pageStatus);
        }
    }, [users.path]);

    return (
        <>
            <Head title="Users - Admin" />
            <AdminDashboard userDetails={userDetails}>
                <Breadcrumb title="All Users" />
                <div className="card h-100 p-0 radius-12">
                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                        <div className="d-flex align-items-center flex-wrap gap-3">
                            <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                            <select
                                className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                value={perPage}
                                onChange={handlePerPageChange}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>

                            <form className="navbar-search">
                                <input
                                    type="text"
                                    className="bg-base h-40-px w-auto"
                                    name="search"
                                    placeholder="Search"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <Icon icon="ion:search-outline" className="icon" />
                            </form>

                            <select
                                className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <option value="" disabled>Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <Link
                            to="/add-user"
                            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        >
                            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                            Add New User
                        </Link>
                    </div>

                    <div className="card-body p-24">
                        <div className="table-responsive scroll-sm">
                            <table className="table bordered-table sm-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <div className="d-flex align-items-center gap-10">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <input
                                                        className="form-check-input radius-4 border input-form-dark"
                                                        type="checkbox"
                                                        name="checkbox"
                                                        id="selectAll"
                                                    />
                                                </div>
                                                S.L
                                            </div>
                                        </th>
                                        <th scope="col">Join Date</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col" className="text-center">Status</th>
                                        <th scope="col" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-10">
                                                    <div className="form-check style-check d-flex align-items-center">
                                                        <input
                                                            className="form-check-input radius-4 border border-neutral-400"
                                                            type="checkbox"
                                                            name="checkbox"
                                                        />
                                                    </div>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={user.profile_picture || '/assets/images/user.png'}
                                                        alt={user.name}
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <span className="text-md mb-0 fw-normal text-secondary-light">{user.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="text-md mb-0 fw-normal text-secondary-light">{user.email}</span></td>
                                            <td><span className="text-md mb-0 fw-normal text-secondary-light">{user.phone_number}</span></td>
                                            <td className="text-center">
                                                <span className={`bg-${user.status === 'active' ? 'success' : 'neutral'}-focus text-${user.status === 'active' ? 'success' : 'neutral'}-600 border border-${user.status === 'active' ? 'success' : 'neutral'}-main px-24 py-4 radius-4 fw-medium text-sm tw-capitalize`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center gap-10 justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    >
                                                        <Icon icon="majesticons:eye-line" className="icon text-xl" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    >
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    >
                                                        <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                            <span>Showing {users.from} to {users.to} of {users.total} entries</span>
                            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                <li className={`page-item ${!users.prev_page_url ? 'disabled' : ''}`}>
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        to={users.prev_page_url || '#'}
                                    >
                                        <Icon icon="ep:d-arrow-left" className="" />
                                    </Link>
                                </li>
                                {Array.from({ length: users.last_page }, (_, i) => i + 1).map(page => (
                                    <li key={page} className={`page-item ${page === users.current_page ? 'active' : ''}`}>
                                        <Link
                                            className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                            to={`${users.path}?page=${page}`}
                                        >
                                            {page}
                                        </Link>
                                    </li>
                                ))}
                                <li className={`page-item ${!users.next_page_url ? 'disabled' : ''}`}>
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        to={users.next_page_url || '#'}
                                    >
                                        <Icon icon="ep:d-arrow-right" className="" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </AdminDashboard>
            <CookiesV />
        </>
    );
};

export default Users;

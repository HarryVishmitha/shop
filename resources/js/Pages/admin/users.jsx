import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";
import { useState, useEffect } from 'react';


const Users = ({ users }) => {
    // Get the perPage value from the URL or default to 10
    const queryParams = new URLSearchParams(window.location.search);
    const initialPerPage = queryParams.get('perPage') || 10; // Default to 10 if not set in the URL

    const [perPage, setPerPage] = useState(initialPerPage); // Store selected perPage
    const breadcrumbs = [
        { label: 'Home', url: route('home'), icon: 'fluent:home-48-regular' },
        { label: 'Admin Dashboard', url: route('admin.dashboard'), icon: null },
        { label: 'Users', url: '', icon: null },
    ];
    // Handle per page shower
    const handlePerPageChange = (event) => {
        const value = event.target.value;
        setPerPage(value); // Update perPage state
        // Update URL with the new perPage value and reload the page
        window.location.href = `${users.path}?page=${users.current_page}&perPage=${value}`;
    };

    useEffect(() => {
        // Sync state with URL in case perPage is changed manually
        const queryParams = new URLSearchParams(window.location.search);
        const pagePerPage = queryParams.get('perPage');
        if (pagePerPage) {
            setPerPage(pagePerPage);
        }
    }, [users.path]);


    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminHeader>
                <AdminNav breadcrumbs={breadcrumbs} />
                <div className="container-fluid tw-mt-3">
                    <div className="tw-bg-white tw-rounded-md tw-shadow tw-p-2">
                        <div className="d-flex justify-content-between tw-px-5 align-items-center tw-mb-4">
                            <div className='buttonsGroups1'>
                                <button className="btn btn-outline-primary d-flex justify-content-center align-items-center hover:tw-font-medium tw-py-4 tw-text-lg tw-mt-3" >
                                    <Icon icon='mingcute:user-add-fill' className='tw-mr-1 tw-w-5 tw-h-5'/>
                                    Add User
                                    <Icon icon="line-md:arrow-right" className='tw-ms-1'/>
                                </button>
                            </div>
                            <div>
                                <select id="perPage" value={perPage} onChange={handlePerPageChange} className="form-select">
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                        <hr className='tw-mb-3' />
                        <div className="container-fluid">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Working Group</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {user.name}
                                                    {user.email_verified_at && (
                                                        <Icon icon='material-symbols:verified-rounded' className='tw-ms-1 tw-text-blue-500'/>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.role.name}</td>
                                            <td>{user.working_group ? user.working_group.name : '-'}</td>
                                            <td>
                                               <span className={`${user.status === 'active' ? 'tw-text-green-500' : ''} ${user.status === 'inactive' ? 'tw-text-yellow-500' : ''} ${user.status === 'suspended' ? 'tw-text-red-500' : ''}`}> {user.status} </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm hover:tw-text-white hover:tw-bg-green-500 tw-rounded-full tw-text-green-500 tw-me-2">
                                                    <Icon icon="mdi:eye-outline" width={20} height={20}/>
                                                </button>
                                                <button className="btn btn-sm hover:tw-text-white hover:tw-bg-blue-500 tw-rounded-full tw-text-blue-500">
                                                    <Icon icon="ph:pencil-fill" width={20} height={20} />
                                                </button>
                                                <button className="btn btn-sm hover:tw-text-white hover:tw-bg-red-500 tw-rounded-full tw-text-red-500">
                                                    <Icon icon="flowbite:trash-bin-outline" width={20} height={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Bootstrap Pagination */}
                            <div className="d-flex justify-content-center tw-mb-3">
                                <nav>
                                    <ul className="pagination">
                                        {/* Previous Button */}
                                        <li className={`page-item ${!users.prev_page_url ? 'disabled' : ''}`}>
                                            <Link href={users.prev_page_url || '#'} className="page-link">Previous</Link>
                                        </li>
                                        {/* Page Numbers */}
                                        {Array.from({ length: users.last_page }, (_, i) => i + 1).map(page => (
                                            <li key={page} className={`page-item ${page === users.current_page ? 'active' : ''}`}>
                                                <Link href={users.path + `?page=${page}`} className="page-link">{page}</Link>
                                            </li>
                                        ))}
                                        {/* Next Button */}
                                        <li className={`page-item ${!users.next_page_url ? 'disabled' : ''}`}>
                                            <Link href={users.next_page_url || '#'} className="page-link">Next</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminHeader>
            <CookiesV />
        </>
    );
};

export default Users;

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";
import Alert from "@/Components/Alert";
import Meta from "@/Components/Metaheads";

const WorkingGroups = ({ userDetails, workingGroups, status: selectedStatus }) => {
    // Initialize filtering and pagination from URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const initialPerPage = queryParams.get('perPage') || 10;
    const [perPage, setPerPage] = useState(initialPerPage);
    const [status, setStatus] = useState(selectedStatus || '');
    const [search, setSearch] = useState('');

    // State for alerts and loading
    const [alert, setAlert] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    // State for selected working group for editing and its form data
    const [selectedWG, setSelectedWG] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        description: '',
        wg_image: '',
        status: 'active',
    });

    // When a working group is selected for editing, prepopulate the form fields
    useEffect(() => {
        if (selectedWG) {
            setEditData({
                name: selectedWG.name || '',
                description: selectedWG.description || '',
                wg_image: selectedWG.wg_image || '',
                status: selectedWG.status || 'active',
            });
        }
    }, [selectedWG]);

    // Handle changes in the edit modal inputs
    const handleEditChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    // Update working group details when the form is submitted
    const handleUpdate = (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        router.patch(route('admin.editWS', selectedWG ? selectedWG.id : ''), editData, {
            preserveState: true,
            onSuccess: () => {
                setAlert({ type: "success", message: "Working Group updated successfully." });
            },
            onError: () => {
                setAlert({ type: "danger", message: "Failed to update Working Group." });
            },
            onFinish: () => {
                setUpdateLoading(false);
            },
        });
    };

    // Handle pagination and filtering
    const handlePerPageChange = (event) => {
        const value = event.target.value;
        setPerPage(value);
        router.visit(`${workingGroups.path}?page=${workingGroups.current_page}&perPage=${value}&status=${status}`);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        // (Optional: Add search filtering logic here)
    };

    const handleStatusChange = (event) => {
        const value = event.target.value;
        setStatus(value);
        router.visit(`${workingGroups.path}?page=${workingGroups.current_page}&perPage=${perPage}&status=${value}`);
    };

    // Update local state when URL parameters change
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const pagePerPage = params.get('perPage');
        const pageStatus = params.get('status');
        if (pagePerPage) setPerPage(pagePerPage);
        if (pageStatus) setStatus(pageStatus);
    }, [workingGroups.path]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <>
            <Head title="Working Groups - Admin Dashboard" />
            <Meta title="Working Groups - Admin Dashboard" description="Manage working groups efficiently." />
            <AdminDashboard userDetails={userDetails}>
                <Breadcrumb title="Working Groups" />
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
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
                                <option value="" disabled>
                                    Select Status
                                </option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="inactivating">Inactivating</option>
                            </select>
                        </div>
                        {/* "Add New Working Group" button opens the modal in add mode (selectedWG null) */}
                        <button
                            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                            data-bs-toggle="modal"
                            data-bs-target="#editWG"
                            onClick={() => {
                                setSelectedWG(null);
                                setEditData({ name: '', description: '', wg_image: '', status: 'active' });
                            }}
                        >
                            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                            Add New Working Group
                        </button>
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
                                        <th scope="col">Created Date</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Total Users</th>
                                        <th scope="col">Total Products</th>
                                        <th scope="col" className="text-center">
                                            Status
                                        </th>
                                        <th scope="col" className="text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workingGroups.data.map((group, index) => (
                                        <tr key={group.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-10">
                                                    <div className="form-check style-check d-flex align-items-center">
                                                        <input
                                                            className="form-check-input radius-4 border border-neutral-400"
                                                            type="checkbox"
                                                            name="checkbox"
                                                        />
                                                    </div>
                                                    {Number(workingGroups.from) + index}
                                                </div>
                                            </td>
                                            <td>{formatTimestamp(group.created_at)}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="position-relative flex-shrink-0 me-12">
                                                        <img
                                                            src={group.wg_image || '/images/favicon.png'}
                                                            alt="Working Group"
                                                            className="w-40-px h-40-px rounded-circle overflow-hidden"
                                                        />
                                                        <span className="position-absolute bottom-0 end-0 bg-dark text-white small px-1 rounded tw-text-[8px]">
                                                            WG
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <span className="text-md mb-0 fw-normal text-secondary-light tw-capitalize">
                                                            {group.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-md mb-0 fw-normal text-secondary-light tw-capitalize">
                                                    {group.description}
                                                </span>
                                            </td>
                                            <td>{group.users_count || 0}</td>
                                            <td>{group.products_count || 0}</td>
                                            <td className="text-center">
                                                <span className="bg-success-focus text-success-600 border border-success-main px-24 py-4 radius-4 fw-medium text-sm tw-capitalize">
                                                    {group.status}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center gap-10 justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editWG"
                                                        onClick={() => setSelectedWG(group)}
                                                    >
                                                        <Icon icon="majesticons:eye-line" className="icon text-xl" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    >
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                            <span>
                                Showing {workingGroups.from} to {workingGroups.to} of {workingGroups.total} entries
                            </span>
                            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                <li className={`page-item ${!workingGroups.prev_page_url ? 'disabled' : ''}`}>
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        to={workingGroups.prev_page_url || '#'}
                                    >
                                        <Icon icon="ep:d-arrow-left" className="" />
                                    </Link>
                                </li>
                                {Array.from({ length: workingGroups.last_page }, (_, i) => i + 1).map(page => (
                                    <li key={page} className={`page-item ${page === workingGroups.current_page ? 'active' : ''}`}>
                                        <Link
                                            className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                            to={`${workingGroups.path}?page=${page}&perPage=${perPage}&status=${status}`}
                                        >
                                            {page}
                                        </Link>
                                    </li>
                                ))}
                                <li className={`page-item ${!workingGroups.next_page_url ? 'disabled' : ''}`}>
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                        to={workingGroups.next_page_url || '#'}
                                    >
                                        <Icon icon="ep:d-arrow-right" className="" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Edit / Add Working Group Modal */}
                <div className="modal fade" id="editWG" tabIndex="-1" aria-labelledby="editWGLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header py-16 px-24 border-0">
                                <h1 className="modal-title fs-5" id="editWGLabel">
                                    {selectedWG ? 'Edit Working Group' : 'Add New Working Group'}
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setSelectedWG(null)}
                                ></button>
                            </div>
                            <div className="modal-body p-24">
                                <form onSubmit={handleUpdate}>
                                    <div className="row">
                                        <div className="col-12 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Working Group Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control radius-8"
                                                placeholder="Enter Working Group Name"
                                                value={editData.name}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                        <div className="col-12 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                className="form-control"
                                                rows={4}
                                                placeholder="Enter Description"
                                                value={editData.description}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                        <div className="col-12 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Image URL
                                            </label>
                                            <input
                                                type="text"
                                                name="wg_image"
                                                className="form-control radius-8"
                                                placeholder="Enter Image URL"
                                                value={editData.wg_image}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center flex-wrap gap-28">
                                            <div className="form-check checked-success d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="status"
                                                    id="Personal"
                                                    value="active"
                                                    checked={editData.status === 'active'}
                                                    onChange={handleEditChange}
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="Personal"
                                                >
                                                    <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                                    Active
                                                </label>
                                            </div>
                                            <div className="form-check checked-danger d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="status"
                                                    id="Holiday"
                                                    value="inactive"
                                                    checked={editData.status === 'inactive'}
                                                    onChange={handleEditChange}
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="Holiday"
                                                >
                                                    <span className="w-8-px h-8-px bg-danger-600 rounded-circle" />
                                                    Inactive
                                                </label>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary" disabled={updateLoading}>
                                                {updateLoading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Edit Modal */}
            </AdminDashboard>
            <CookiesV />
        </>
    );
};

export default WorkingGroups;

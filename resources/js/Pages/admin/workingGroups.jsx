import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import AdminNav from '@/Components/AdminNav';
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";
import Alert from "@/Components/Alert";

const workingGroups = ({ userDetails, workingGroups, }) => {

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <>
            <Head title="Working Groups - Admin Dashboard" />
            <AdminDashboard userDetails = {userDetails}>
                <Breadcrumb title = "Working Groups" />
                <div className="card h-100 p-0 radius-12">
                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                        <div className="d-flex align-items-center flex-wrap gap-3">
                            <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                            <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Number">
                                <option value="Select Number" disabled>
                                    Select Number
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                            <form className="navbar-search">
                                <input
                                    type="text"
                                    className="bg-base h-40-px w-auto"
                                    name="search"
                                    placeholder="Search"
                                />
                                <Icon icon="ion:search-outline" className="icon" />
                            </form>
                            <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Status">
                                <option value="Select Status" disabled>
                                    Select Status
                                </option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <Link
                            to="/add-user"
                            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        >
                            <Icon
                                icon="ic:baseline-plus"
                                className="icon text-xl line-height-1"
                            />
                            Add New User
                        </Link>
                    </div>
                    <div className="card-body p-24">
                        <div
                            className="alert alert-warning bg-warning-100 text-warning-600 border-warning-100 px-24 py-11 mb-0 fw-semibold text-lg radius-8 mb-3"
                            role="alert"
                        >
                            <div className="d-flex align-items-start justify-content-between text-lg">
                                <div className="d-flex align-items-start gap-2">
                                    <Icon
                                        icon="mdi:clock-outline"
                                        className="icon text-xl mt-4 flex-shrink-0"
                                    />
                                    <div>
                                        <span>Please Make sure!</span>
                                        <p className="fw-medium text-warning-600 text-sm mt-8">
                                            Working Groups can't be deleted. You can only deactivate them. To Deativate working groups, click on the edit button and change the status to inactive.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                    {workingGroups.map((group, index) => (
                                    <tr key={index}>
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
                                        <td>{formatTimestamp(group.created_at)}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src="assets/images/user-list/user-list1.png"
                                                    alt="Wowdash"
                                                    className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                />
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
                                        <td>{group.users_count ? group.users_count : 0}</td>
                                        <td>{group.products_count ? group.products_count : 0}</td>
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
                                                >
                                                    <Icon
                                                        icon="majesticons:eye-line"
                                                        className="icon text-xl"
                                                    />
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
                            <span>Showing 1 to 10 of 12 entries</span>
                            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                <li className="page-item">
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                        to="#"
                                    >
                                        <Icon icon="ep:d-arrow-left" className="" />
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link
                                        className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white"
                                        to="#"
                                    >
                                        1
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                        to="#"
                                    >
                                        2
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                        to="#"
                                    >
                                        3
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                        to="#"
                                    >
                                        4
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                        to="#"
                                    >
                                        5
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                        to="#"
                                    >
                                        {" "}
                                        <Icon icon="ep:d-arrow-right" className="" />{" "}
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
}

export default workingGroups;

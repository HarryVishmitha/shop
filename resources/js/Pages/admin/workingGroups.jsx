import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";
import CookiesV from '@/Components/CookieConsent';
import { Icon } from "@iconify/react";

const WorkingGroups = ({ userDetails, workingGroups, status: selectedStatus }) => {
  // Initialize perPage and status from query params or props
  const queryParams = new URLSearchParams(window.location.search);
  const initialPerPage = queryParams.get('perPage') || 10;
  const [perPage, setPerPage] = useState(initialPerPage);
  const [status, setStatus] = useState(selectedStatus || '');
  const [search, setSearch] = useState('');

  // Handle perPage change and update the URL query parameters
  const handlePerPageChange = (event) => {
    const value = event.target.value;
    setPerPage(value);
    router.visit(`${workingGroups.path}?page=${workingGroups.current_page}&perPage=${value}&status=${status}`);
  };

  // Handle search input changes (if you decide to implement search filtering)
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    // Optionally add search filtering logic
  };

  // Handle status filter changes
  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatus(value);
    router.visit(`${workingGroups.path}?page=${workingGroups.current_page}&perPage=${perPage}&status=${value}`);
  };

  // Update perPage and status state when URL query parameters change
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const pagePerPage = queryParams.get('perPage');
    const pageStatus = queryParams.get('status');
    if (pagePerPage) setPerPage(pagePerPage);
    if (pageStatus) setStatus(pageStatus);
  }, [workingGroups.path]);

  // Helper function for formatting timestamps
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Head title="Working Groups - Admin Dashboard" />
      <AdminDashboard userDetails={userDetails}>
        <Breadcrumb title="Working Groups" />
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Inactivating">Inactivating</option>
              </select>
            </div>
            <button
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal" data-bs-target="#editWG"
              type="button"
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
                          {workingGroups.from + index}
                        </div>
                      </td>
                      <td>{formatTimestamp(group.created_at)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={group.wg_image || 'assets/images/user-list/user-list1.png'}
                            alt="Working Group"
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

        {/* Modal Start */}
        <div
          className="modal fade"
          id="editWG"
          tabIndex={-1}
          aria-labelledby="editWG"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16 bg-base">
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1 className="modal-title fs-5" id="editWG">
                  Add New Role
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body p-24">
                <form action="#">
                  <div className="row">
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Role Name
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        placeholder="Enter Role  Name"
                      />
                    </div>
                    <div className="col-12 mb-20">
                      <label
                        htmlFor="desc"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="desc"
                        rows={4}
                        cols={50}
                        placeholder="Write some text"
                        defaultValue={""}
                      />
                    </div>
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Status{" "}
                      </label>
                      <div className="d-flex align-items-center flex-wrap gap-28">
                        <div className="form-check checked-success d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="label"
                            id="Personal"
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
                            name="label"
                            id="Holiday"
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
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                      <button
                        type="reset"
                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary border border-primary-600 text-md px-48 py-12 radius-8"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Modal End */}
      </AdminDashboard>
      <CookiesV />
    </>
  );
};

export default WorkingGroups;

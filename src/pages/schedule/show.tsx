import React, { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Calendar,
  MapPin,
  Ship,
  Package,
  Clock,
  Info,
  User,
  Eye,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Swal from "sweetalert2";
import type { ShippingSchedule } from "./index";
import type { ShippingRequest } from "../requests/index";

// Route type definition
export interface Route {
  id: string;
  routeName: string;
  departure: string;
  destination: string;
}

// Show Shipping Schedule Component
const ShowShippingSchedule: React.FC<{
  isDarkTheme: boolean;
  schedule: ShippingSchedule;
  route: Route;
  requests: ShippingRequest[];
  onEdit: () => void;
  onClose: () => void;
  onViewRequest?: (request: ShippingRequest) => void;
  onEditRequest?: (request: ShippingRequest) => void;
  onDeleteRequest?: (id: string) => void;
  onUpdateStatus?: (scheduleId: string, status: string) => void;
  onUpdateShippingStatus?: (scheduleId: string, shippingStatus: string) => void;
}> = ({
  isDarkTheme,
  schedule,
  route,
  requests,
  onEdit,
  onClose,
  onViewRequest,
  onEditRequest,
  onDeleteRequest,
  onUpdateStatus,
  onUpdateShippingStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Filter requests that belong to this schedule
  const scheduleRequests = requests.filter(
    (req) => req.batchId === schedule.id,
  );

  // Apply search and filters
  const filteredRequests = scheduleRequests.filter((request) => {
    const matchesSearch =
      request.cargoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status.toLowerCase() === statusFilter;
    const matchesPayment =
      paymentFilter === "all" ||
      request.paymentStatus.toLowerCase() === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Full":
        return "bg-red-500 text-white border-red-600";
      case "Almost Full":
        return "bg-yellow-500 text-white border-yellow-600";
      case "Available":
        return "bg-green-500 text-white border-green-600";
      case "Completed/Closed":
        return "bg-gray-500 text-white border-gray-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getShippingStatusColor = (shippingStatus: string) => {
    switch (shippingStatus) {
      case "Warehouse":
        return "bg-blue-500 text-white border-blue-600";
      case "Loaded":
        return "bg-purple-500 text-white border-purple-600";
      case "In Transit":
        return "bg-orange-500 text-white border-orange-600";
      case "Arrived":
        return "bg-teal-500 text-white border-teal-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getShippingStatusIcon = (status: string) => {
    switch (status) {
      case "Warehouse":
        return Package;
      case "Loaded":
        return TrendingUp;
      case "In Transit":
        return Ship;
      case "Arrived":
        return MapPin;
      default:
        return Package;
    }
  };

  const StatusIcon = getShippingStatusIcon(schedule.shippingStatus);

  const calculateDuration = () => {
    const start = new Date(schedule.startingDate);
    const end = new Date(schedule.estimatedArrivalDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate journey progress
  const startDate = new Date(schedule.startingDate);
  const endDate = new Date(schedule.estimatedArrivalDate);
  const today = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  const getRequestStatusBadge = (
    status: string,
    type: "status" | "payment",
  ) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";

    if (type === "status") {
      return status === "Accepted"
        ? `${baseClasses} bg-green-500 text-white`
        : `${baseClasses} bg-red-500 text-white`;
    }

    if (type === "payment") {
      return status === "Paid"
        ? `${baseClasses} bg-green-500 text-white`
        : `${baseClasses} bg-yellow-500 text-white`;
    }

    return baseClasses;
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!onUpdateStatus) return;

    const { value: newStatus } = await Swal.fire({
      title: "Update Schedule Status",
      text: "Select the new status for this schedule",
      input: "select",
      inputOptions: {
        Available: "Available",
        "Almost Full": "Almost Full",
        Full: "Full",
      },
      inputValue: schedule.status,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      inputValidator: (value) => {
        if (!value) {
          return "Please select a status";
        }
        return null;
      },
    });

    if (newStatus) {
      onUpdateStatus(schedule.id, newStatus);
      Swal.fire({
        icon: "success",
        title: "Status Updated!",
        text: `Schedule status has been updated to ${newStatus}`,
        confirmButtonColor: "#f97316",
        timer: 2000,
      });
    }
  };

  // Handle shipping status update
  const handleShippingStatusUpdate = async () => {
    if (!onUpdateShippingStatus) return;

    const { value: newStatus } = await Swal.fire({
      title: "Update Shipping Status",
      text: "Select the new shipping status",
      input: "select",
      inputOptions: {
        Warehouse: "Warehouse",
        Loaded: "Loaded",
        "In Transit": "In Transit",
        Arrived: "Arrived",
      },
      inputValue: schedule.shippingStatus,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      inputValidator: (value) => {
        if (!value) {
          return "Please select a status";
        }
        return null;
      },
    });

    if (newStatus) {
      onUpdateShippingStatus(schedule.id, newStatus);
      Swal.fire({
        icon: "success",
        title: "Shipping Status Updated!",
        text: `Shipping status has been updated to ${newStatus}`,
        confirmButtonColor: "#f97316",
        timer: 2000,
      });
    }
  };

  return (
    <div>
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
            isDarkTheme
              ? "text-slate-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schedules
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
            >
              Schedule Details
            </h1>
            <p
              className={`${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
            >
              View complete schedule and shipping requests
            </p>
          </div>
          <button
            onClick={onEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit Schedule
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Overview Card */}
          <div
            className={`rounded-xl border p-6 ${isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
                  <Ship className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                  >
                    {schedule.scheduleTitle}
                  </h2>
                  <p
                    className={`text-sm ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                  >
                    {route.routeName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(schedule.status)}`}
                >
                  {schedule.status}
                </span>
                {schedule.status !== "Full" && (
                  <button
                    onClick={
                      onUpdateStatus
                        ? handleStatusUpdate
                        : () => {
                            Swal.fire({
                              icon: "warning",
                              title: "Not Connected",
                              text: "Please pass onUpdateStatus prop to enable status editing",
                              confirmButtonColor: "#f97316",
                            });
                          }
                    }
                    className="p-2 rounded-lg transition-colors bg-orange-100 hover:bg-orange-200 text-orange-600"
                    title="Edit Status"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Route Visualization with Timeline */}
            <div
              className={`p-6 rounded-xl border ${isDarkTheme ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin
                      className={`w-5 h-5 ${isDarkTheme ? "text-green-400" : "text-green-600"}`}
                    />
                    <span
                      className={`text-sm font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                    >
                      Departure
                    </span>
                  </div>
                  <p
                    className={`text-lg font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                  >
                    {route.departure}
                  </p>
                  <p
                    className={`text-xs mt-1 ${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                  >
                    {new Date(schedule.startingDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div className="flex items-center px-6">
                  <div
                    className={`h-px w-20 ${isDarkTheme ? "bg-slate-600" : "bg-gray-300"}`}
                  ></div>
                  <div
                    className={`mx-2 text-2xl ${isDarkTheme ? "text-slate-600" : "text-gray-400"}`}
                  >
                    →
                  </div>
                  <div
                    className={`h-px w-20 ${isDarkTheme ? "bg-slate-600" : "bg-gray-300"}`}
                  ></div>
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <span
                      className={`text-sm font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                    >
                      Destination
                    </span>
                    <MapPin
                      className={`w-5 h-5 ${isDarkTheme ? "text-red-400" : "text-red-600"}`}
                    />
                  </div>
                  <p
                    className={`text-lg font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                  >
                    {route.destination}
                  </p>
                  <p
                    className={`text-xs mt-1 ${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                  >
                    {new Date(schedule.estimatedArrivalDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Horizontal Timeline */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4
                  className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                >
                  <Clock className="w-4 h-4" />
                  Timeline
                </h4>

                <div className="flex items-start gap-4">
                  {/* Created Date */}
                  <div className="flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isDarkTheme ? "bg-slate-900" : "bg-gray-100"}`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-xs font-medium mb-1 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                      >
                        Created On
                      </p>
                      <p
                        className={`text-sm font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                      >
                        {new Date(schedule.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isDarkTheme ? "bg-green-900/30" : "bg-green-100"}`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${isDarkTheme ? "text-green-400" : "text-green-600"}`}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-xs font-medium mb-1 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                      >
                        Departure Date
                      </p>
                      <p
                        className={`text-sm font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                      >
                        {new Date(schedule.startingDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isDarkTheme ? "bg-blue-900/30" : "bg-blue-100"}`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-xs font-medium mb-1 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                      >
                        Estimated Arrival
                      </p>
                      <p
                        className={`text-sm font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                      >
                        {new Date(
                          schedule.estimatedArrivalDate,
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Updates Timeline */}
              {schedule.transitUpdates.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className={`text-sm font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                    >
                      Latest Updates
                    </h4>
                    <span
                      className={`text-xs ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                    >
                      {schedule.transitUpdates.length} update
                      {schedule.transitUpdates.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {schedule.transitUpdates
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .slice(0, 3)
                      .map((update, index) => (
                        <div
                          key={update.id}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            isDarkTheme ? "bg-slate-800" : "bg-white"
                          }`}
                        >
                          <div
                            className={`mt-1 w-2 h-2 rounded-full ${
                              index === 0
                                ? "bg-orange-500"
                                : isDarkTheme
                                  ? "bg-slate-600"
                                  : "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin
                                className={`w-4 h-4 ${isDarkTheme ? "text-slate-400" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                              >
                                {update.location}
                              </span>
                              <span
                                className={`text-xs ${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                              >
                                {new Date(update.date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" },
                                )}
                              </span>
                            </div>
                            <p
                              className={`text-xs ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                            >
                              {update.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Journey Progress Bar (for In Transit) */}
              {schedule.shippingStatus === "In Transit" && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                    >
                      Journey Progress
                    </span>
                    <span
                      className={`text-sm font-semibold ${isDarkTheme ? "text-orange-400" : "text-orange-500"}`}
                    >
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDarkTheme ? "bg-slate-800" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div
            className={`rounded-xl border p-6 ${isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
            >
              <Info className="w-5 h-5" />
              Quick Information
            </h3>

            <div className="space-y-4">
              {/* Duration */}
              <div
                className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-900" : "bg-gray-50"}`}
              >
                <p
                  className={`text-sm font-medium mb-1 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                >
                  Journey Duration
                </p>
                <p
                  className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                >
                  {calculateDuration()}{" "}
                  {calculateDuration() === 1 ? "Day" : "Days"}
                </p>
              </div>

              {/* Shipping Status */}
              <div
                className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-900" : "bg-gray-50"}`}
              >
                <p
                  className={`text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                >
                  Shipping Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getShippingStatusColor(schedule.shippingStatus)}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {schedule.shippingStatus}
                  </div>
                  {schedule.shippingStatus !== "Arrived" && (
                    <button
                      onClick={
                        onUpdateShippingStatus
                          ? handleShippingStatusUpdate
                          : () => {
                              Swal.fire({
                                icon: "warning",
                                title: "Not Connected",
                                text: "Please pass onUpdateShippingStatus prop to enable shipping status editing",
                                confirmButtonColor: "#f97316",
                              });
                            }
                      }
                      className="p-2 rounded-lg transition-colors bg-orange-100 hover:bg-orange-200 text-orange-600"
                      title="Edit Shipping Status"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Schedule ID */}
              <div
                className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-900" : "bg-gray-50"}`}
              >
                <p
                  className={`text-sm font-medium mb-1 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                >
                  Schedule ID
                </p>
                <p
                  className={`text-lg font-mono font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                >
                  #{schedule.id}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div
            className={`rounded-xl border p-6 ${isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
            >
              Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={onEdit}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Edit2 className="w-4 h-4" />
                Edit Schedule
              </button>
              <button
                onClick={onClose}
                className={`w-full px-4 py-3 rounded-xl font-medium border transition-colors flex items-center justify-center gap-2 ${
                  isDarkTheme
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Requests Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2
            className={`text-2xl font-bold mb-2 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
          >
            Shipping Requests
          </h2>
          <p className={`${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}>
            All requests associated with this schedule
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <Package
                className={`w-5 h-5 ${isDarkTheme ? "text-slate-400" : "text-gray-400"}`}
              />
              <span
                className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                {scheduleRequests.length}
              </span>
            </div>
            <p
              className={`text-xs font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
            >
              Total Requests
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span
                className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                {scheduleRequests.filter((r) => r.status === "Accepted").length}
              </span>
            </div>
            <p
              className={`text-xs font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
            >
              Accepted
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span
                className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                {scheduleRequests.filter((r) => r.status === "Rejected").length}
              </span>
            </div>
            <p
              className={`text-xs font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
            >
              Rejected
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <span
                className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                {
                  scheduleRequests.filter((r) => r.paymentStatus === "Paid")
                    .length
                }
              </span>
            </div>
            <p
              className={`text-xs font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
            >
              Paid
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkTheme ? "text-slate-400" : "text-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Search by cargo, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                isDarkTheme
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isDarkTheme
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="all">All Payment</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Requests Table */}
        <div
          className={`rounded-xl overflow-hidden ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-xl`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkTheme ? "bg-slate-900" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Cargo
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Customer
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Locations
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Payment
                  </th>
                  <th
                    className={`px-6 py-4 text-right text-sm font-semibold ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkTheme ? "divide-slate-700" : "divide-gray-200"}`}
              >
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Package
                        className={`w-12 h-12 mx-auto mb-3 ${isDarkTheme ? "text-slate-600" : "text-gray-300"}`}
                      />
                      <p
                        className={`text-lg font-medium ${isDarkTheme ? "text-slate-400" : "text-gray-500"}`}
                      >
                        {scheduleRequests.length === 0
                          ? "No requests for this schedule"
                          : "No requests found"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className={`transition-colors ${isDarkTheme ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                    >
                      <td
                        className={`px-6 py-4 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{request.cargoName}</p>
                            <p
                              className={`text-sm ${isDarkTheme ? "text-slate-400" : "text-gray-500"}`}
                            >
                              {request.description.length > 30
                                ? request.description.substring(0, 30) + "..."
                                : request.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{request.customerName}</span>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                      >
                        <div className="text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <span
                              className={`${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                            >
                              From:
                            </span>
                            <span>
                              {request.pickupLocation === "home"
                                ? "Home"
                                : "Office"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                              className={`${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                            >
                              To:
                            </span>
                            <span>
                              {request.deliveryLocation === "home"
                                ? "Home"
                                : "Office"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={getRequestStatusBadge(
                            request.status,
                            "status",
                          )}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={getRequestStatusBadge(
                            request.paymentStatus,
                            "payment",
                          )}
                        >
                          {request.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {onViewRequest && (
                            <button
                              onClick={() => onViewRequest(request)}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkTheme
                                  ? "hover:bg-slate-600 text-slate-300"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEditRequest && (
                            <button
                              onClick={() => onEditRequest(request)}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkTheme
                                  ? "hover:bg-slate-600 text-slate-300"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteRequest && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this request?",
                                  )
                                ) {
                                  onDeleteRequest(request.id);
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkTheme
                                  ? "hover:bg-red-900/20 text-red-400"
                                  : "hover:bg-red-50 text-red-600"
                              }`}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowShippingSchedule;

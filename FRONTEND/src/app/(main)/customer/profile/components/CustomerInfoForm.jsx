/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { Mail, Phone, User, UserCheck } from "lucide-react";
import React from "react";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function CustomerInfoForm({
  formData,
  handleChange,
  handleSubmit,
  editMode,
  loading,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <Label
            htmlFor="full_name"
            className="text-sm font-semibold text-slate-700"
          >
            Full Name
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User
                className={`h-4 w-4 ${editMode ? "text-emerald-500" : "text-slate-400"}`}
              />
            </span>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="h-10 border-slate-200 bg-slate-50/50 pl-10 focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-semibold text-slate-700"
          >
            Username
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserCheck
                className={`h-4 w-4 ${editMode ? "text-emerald-500" : "text-slate-400"}`}
              />
            </span>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="h-10 border-slate-200 bg-slate-50/50 pl-10 focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700"
          >
            Email Address
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail
                className={`h-4 w-4 ${editMode ? "text-emerald-500" : "text-slate-400"}`}
              />
            </span>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="h-10 border-slate-200 bg-slate-50/50 pl-10 focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label
            htmlFor="phone_number"
            className="text-sm font-semibold text-slate-700"
          >
            Phone Number
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone
                className={`h-4 w-4 ${editMode ? "text-emerald-500" : "text-slate-400"}`}
              />
            </span>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!editMode}
              className="h-10 border-slate-200 bg-slate-50/50 pl-10 focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

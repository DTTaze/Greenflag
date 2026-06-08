import React from "react";
import { User, Mail, Phone, UserCheck } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function CustomerInfoForm({
  formData,
  handleChange,
  handleSubmit,
  editMode,
  loading
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-semibold text-slate-700">
            Full Name
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className={`w-4 h-4 ${editMode ? 'text-emerald-500' : 'text-slate-400'}`} />
            </span>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="pl-10 h-10 bg-slate-50/50 focus:bg-white border-slate-200 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
            Username
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCheck className={`w-4 h-4 ${editMode ? 'text-emerald-500' : 'text-slate-400'}`} />
            </span>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="pl-10 h-10 bg-slate-50/50 focus:bg-white border-slate-200 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email Address
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`w-4 h-4 ${editMode ? 'text-emerald-500' : 'text-slate-400'}`} />
            </span>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="pl-10 h-10 bg-slate-50/50 focus:bg-white border-slate-200 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-sm font-semibold text-slate-700">
            Phone Number
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className={`w-4 h-4 ${editMode ? 'text-emerald-500' : 'text-slate-400'}`} />
            </span>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!editMode}
              className="pl-10 h-10 bg-slate-50/50 focus:bg-white border-slate-200 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

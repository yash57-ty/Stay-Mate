// ========================= PGCARD.JSX =========================

import {
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Users,
  IndianRupee,
  MapPin,
} from "lucide-react";

export default function PgCard({
  pg,
  isExpanded,
  onToggle,
}) {

  return (

    <div
      className={`bg-white rounded-[30px] overflow-hidden border border-gray-100 transition-all duration-300 ${
        isExpanded
          ? "shadow-2xl"
          : "hover:shadow-lg"
      }`}
    >

      {/* ===== IMAGE PREVIEW ===== */}
      <div className="relative">

        <img
          src={`http://localhost:8080${pg.houseUrls[0]}`}
          alt="pg"
          className="h-72 w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* RENT */}
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-2xl shadow-lg">

          <div className="flex items-center gap-1">

            <IndianRupee size={18} />

            <span className="font-bold text-lg">
              {pg.rent}
            </span>

          </div>

        </div>

        {/* ADDRESS */}
        <div className="absolute bottom-5 left-5 text-white">

          <h2 className="text-3xl font-bold">
            {pg.address}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-gray-200">

            <MapPin size={16} />

            <p>{pg.rentType}</p>

          </div>

        </div>

      </div>

      {/* ===== TOP INFO ===== */}
      <div
        onClick={onToggle}
        className="p-5 cursor-pointer"
      >

        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="space-y-2">

            <div className="flex items-center gap-2 text-gray-600">

              <Users size={18} />

              <span>Pg-Id: {pg.Id}</span>

            </div>

            <div className="flex items-center gap-2 text-gray-600">

              <Users size={18} />

              <span>Capacity: {pg.capacity}</span>

            </div>

            <div className="flex items-center gap-2 text-gray-600">

              <Mail size={18} />

              <span className="truncate">
                {pg.email}
              </span>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            {isExpanded ? (
              <ChevronUp size={28} />
            ) : (
              <ChevronDown size={28} />
            )}

          </div>

        </div>

      </div>

      {/* ===== EXPANDED ===== */}
      {isExpanded && (

        <div className="px-5 pb-6 animate-fadeIn">

          <div className="h-px bg-gray-200 mb-6" />

          {/* GALLERY */}
          <div className="overflow-x-auto flex gap-4 pb-2 scrollbar-hide">

            {pg.houseUrls.map((img, index) => (

              <img
                key={index}
                src={`http://localhost:8080${img}`}
                alt="pg"
                className="h-72 min-w-[320px] rounded-3xl object-cover shadow-md"
              />

            ))}

          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">

            <div className="bg-gray-50 rounded-3xl p-5">

              <p className="text-gray-400 text-sm">
                Contact
              </p>

              <div className="flex items-center gap-2 mt-3">

                <Phone size={18} />

                <p className="font-semibold text-lg">
                  {pg.phone}
                </p>

              </div>

            </div>

            <div className="bg-gray-50 rounded-3xl p-5">

              <p className="text-gray-400 text-sm">
                Rent Type
              </p>

              <p className="font-semibold text-lg mt-3">
                {pg.rentType}
              </p>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <a
              href={`tel:${pg.phone}`}
              className="flex-1"
            >

              <button className="w-full border border-black py-4 rounded-2xl font-semibold hover:bg-black hover:text-white transition">
                Contact Owner
              </button>

            </a>

          </div>

        </div>

      )}

    </div>
  );
}
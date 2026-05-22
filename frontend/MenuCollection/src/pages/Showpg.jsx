// ========================= SHOWPG.JSX =========================

import React, { useEffect, useState } from "react";
import PgCard from "./PgCard"

function Showpg() {

  const gender = localStorage.getItem("gender");

  const [pg, setpg] = useState([]);
  const [city, setCity] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
      async function fetchCity() {
        try {
          const res = await fetch(
            "http://localhost:8080/pg/getPgCities",{
              credentials:"include"
            }
          );
          const data = await res.json();
          setCities(data);
          console.log(data)
        } catch (err) {
          console.error(err);
        }
      }
      fetchCity();
    }, []);


  useEffect(() => {

    async function fetchpg() {

      try {

        setLoading(true);

        const res = await fetch(
          `http://localhost:8080/pg/getPg?city=${city}&gender=${gender}`,{
            credentials:"include"
          }
        );

        const data = await res.json();
        setSearched(true);
        setpg(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (city !== "") {
      fetchpg();
    }

  }, [city]);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (

    <div className="min-h-screen bg-[#F7F7F7]">

      {/* HEADER */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">

        <div className="max-w-5xl mx-auto px-4 py-4">

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Find Your Perfect PG
              </h1>

              <p className="text-gray-500 mt-1">
                Comfortable stays near you
              </p>
            </div>

    {/* search */}
    <div className="relative w-[400px]">

      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onFocus={() => setShowCityList(true)}
        className="w-full border border-gray-300 rounded-2xl px-5 py-3 outline-none shadow-sm focus:ring-2 focus:ring-black"
      />

      {/* dropdown */}
      {
        showCityList && (

          <div className="absolute top-14 w-full bg-white rounded-2xl shadow-xl max-h-52 overflow-y-auto z-50 border">

            {
              cities
                .filter((c) =>
                  c.toLowerCase().includes(city.toLowerCase())
                )
                .map((c, index) => (

                  <div
                    key={index}
                    className="px-5 py-3 hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => {
                      setCity(c);
                      setShowCityList(false);
                    }}
                  >
                    {c}
                  </div>

                ))
            }

          </div>

        )
      }

    </div>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {loading ? (

          <div className="flex justify-center items-center h-[50vh]">

            <div className="h-14 w-14 border-4 border-black border-t-transparent rounded-full animate-spin" />

          </div>

        ) : (

          <div className="space-y-6">

            {pg.map((item) => (

              <PgCard
                key={item.Id}
                pg={item}
                isExpanded={expandedId === item.Id}
                onToggle={() => handleToggle(item.Id)}
              />

            ))}

          </div>

        )}

        {searched && !loading && pg.length === 0 && (

          <div className="text-center mt-20">

            <h2 className="text-3xl font-bold text-gray-700">
              No PG Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another city
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Showpg;
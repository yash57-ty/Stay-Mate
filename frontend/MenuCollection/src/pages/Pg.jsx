import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pg() {

  const [cities, setCities] = useState([]);
  const [pg, setPg] = useState([]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [city, setCity] = useState("");
  const [showCityList, setShowCityList] = useState(false);
  const [selectedPg, setSelectedPg] = useState(null);
  const [confirmation,setconfirmation]=useState(false)

  // fetch cities
  useEffect(() => {
    async function fetchCity() {
      try {
        const res = await fetch(
          "http://localhost:8080/admin/getPgCities",{
            credentials:"include"
          }
        );
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCity();
  }, []);


      async function handelsubmit(id,result) {
        
      try {
        const res = await fetch(`http://localhost:8080/admin/confirm/${id}/${result}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:"include",
          body: id + "",
        });
        const data = await res.text();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
      setconfirmation(prev=>!prev)
    }
  // fetch pg
  useEffect(() => {

    async function fetchPg() {

      try {

        const res = await fetch(
          `http://localhost:8080/admin/getPg?city=${city}`,{
            credentials:"include"
          }
        );
        const data = await res.json();
        
        console.log(data)
        // add current image index
        const updated = data.map((item) => ({
          ...item,
          currentImage: 0,
        }));
        setPg(updated);

      } catch (err) {
      }
    }

    if (city !== "") {
      fetchPg();
    }

  }, [city,confirmation]);

  // next image
  function nextImage(index) {

    const updated = [...pg];

    updated[index].currentImage =
      (updated[index].currentImage + 1) %
      updated[index].imageUrls.length;

    setPg(updated);
  }

  // prev image
  function prevImage(index) {

    const updated = [...pg];

    updated[index].currentImage =
      updated[index].currentImage === 0
        ? updated[index].imageUrls.length - 1
        : updated[index].currentImage - 1;
    setPg(updated);
  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* top section */}
<div className="bg-white shadow-sm border-b">

  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

    {/* left title */}
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Find PG
      </h1>

      <p className="text-gray-500 text-sm mt-1">
        Search best PG near your city
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
      {/* pg cards */}
      <div className="max-w-7xl mx-auto p-6 
grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

  {
    pg.map((item, index) => (

      <div
        key={index}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 w-full"
      >

        {/* image slider */}
        <div className="relative">

          <img
            src={item.imageUrls[item.currentImage]}
            alt="pg"
            className="w-full h-52 object-cover"
          />

          {/* left */}
          <button
            onClick={() => prevImage(index)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
          >
            <ChevronLeft size={18} />
          </button>

          {/* right */}
          <button
            onClick={() => nextImage(index)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
          >
            <ChevronRight size={18} />
          </button>

        </div>

        {/* details */}
        <div className="p-4">

          <div className="flex justify-between items-center">

            <h2 className="text-xl font-bold">
              {item.Name}
            </h2>

            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
              Available
            </span>

          </div>

          <p className="text-gray-500 mt-2 text-sm">
            📍 {item.address}
          </p>

          <div className="mt-4 space-y-1 text-sm">

            <p>
              💰 <span className="font-semibold">Rent:</span> ₹{item.rent}
            </p>

            <p>
              🛏️ <span className="font-semibold">Capacity:</span> {item.capacity}
            </p>

            <p>
              👨 <span className="font-semibold">Gender:</span> {item.gender}
            </p>

          </div>

          {/* button */}
          <button
            onClick={() => setSelectedPg(item)}
            className="w-full mt-4 bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition"
          >
            View Details
          </button>

        </div>

      </div>

    ))
  }

</div>

      {/* modal */}
      {
        selectedPg && (

          <div  className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4">

            <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

              <div className="relative">

  <img
    src={selectedPg.imageUrls[modalImageIndex]}
    alt="pg"
    className="w-full h-52 object-cover"
  />

  {/* left */}
  <button
    onClick={() =>
      setModalImageIndex(
        modalImageIndex === 0
          ? selectedPg.imageUrls.length - 1
          : modalImageIndex - 1
      )
    }
    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
  >
    <ChevronLeft size={16}/>
  </button>

  {/* right */}
  <button
    onClick={() =>
      setModalImageIndex(
        (modalImageIndex + 1) %
        selectedPg.imageUrls.length
      )
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
  >
    <ChevronRight size={16}/>
  </button>

</div>

              <div className="p-6">

                <div className="flex justify-between items-center">

                  <h2 className="text-3xl font-bold">
                    {selectedPg.Name}
                  </h2>

                  <button
                    onClick={() => setSelectedPg(null)}
                    className="text-2xl"
                  >
                    ✕
                  </button>

                </div>

                <div className="mt-5 space-y-3 text-lg">

                  <p>
                    📍 {selectedPg.address}
                  </p>

                  <p>
                    💰 Rent: ₹{selectedPg.rent}
                  </p>

                  <p>
                    🛏️ Capacity: {selectedPg.capacity}
                  </p>

                  <p>
                    👨 Gender: {selectedPg.gender}
                  </p>

                  <p>
                    🏠 Type: {selectedPg.rentType}
                  </p>
                  <p>
                    📞 Phone: {selectedPg.phone}
                  </p>
                </div>

                <div className="flex gap-4 mt-4">
  
                <button
                    className="w-1/2 bg-black text-white py-4 rounded-2xl text-lg"
                    onClick={() => handelsubmit(selectedPg.id,"select")}
                >
                  Select
                </button>
                <button
                  className="w-1/2 bg-red-500 text-white py-4 rounded-2xl text-lg"
                  onClick={() => handelsubmit(selectedPg.id,"reject")}
                >
                  Reject
                </button>
              </div>
              </div>
            </div>
          </div>
        )
      }
    </div>

  );
}

export default Pg;
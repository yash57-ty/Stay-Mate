import React, { useEffect, useState } from "react";

function ManagePg() {


  const [pg, setPg] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPg, setSelectedPg] = useState(null);
  const [capacity, setCapacity] = useState(0);
  const [action,setAction]=useState("increase")

  const handleUpdate = async () => {

  if (Number(capacity) > Number(selectedPg.capacity)) {

    alert("Capacity cannot be greater than actual capacity");

    return;
  }


  try {

    let cap = Number(capacity);
    cap= action==="increase" ? cap*-1 :cap 
    const res = await fetch(
      `http://localhost:8080/pg/updateCap/${selectedPg.Id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(cap),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update capacity");
    }

    const data = await res.json();

    console.log(data);

    setOpenModal(false);

  } catch (err) {

    console.error(err);
  }
};
  useEffect(() => {

    async function fetchDetail() {

      try {

        const res = await fetch(
          `http://localhost:8080/pg/managePg`,{
            credentials:"include"
          }
        );

        const data = await res.json();

        setPg(data);

        console.log(data);

      } catch (err) {
        console.error(err);
      }
    }

    fetchDetail();

  }, []);

  const handleOpen = (item) => {
    setSelectedPg(item);
    setOpenModal(true);
  };

  return (

    <div className="min-h-screen bg-[#F7F7F7] p-8">

      {/* HEADING */}
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-800">
          Manage PG
        </h1>

        <p className="text-gray-500 mt-2">
          Update your PG information
        </p>

      </div>

      {/* CARD LIST */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {pg.map((item) => (

          <div
            key={item.Id}
            className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition"
          >

            {/* ICON */}
            <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
              🏢
            </div>

            {/* INFO */}
            <div className="mt-6">

              <h2 className="text-2xl font-bold text-gray-800">
                {item.Address}
              </h2>
              
              <h2 className="text-2xl font-bold text-gray-800">
                {item.Id}
              </h2>

              <p className="text-gray-500 mt-2">
                Manage PG details and capacity
              </p>

            </div>

            {/* BUTTON */}
            <button
              onClick={() => handleOpen(item)}
              className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
            >
              Open Details
            </button>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {
        openModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[90%] max-w-md rounded-3xl p-8 relative animate-fadeIn">

              {/* CLOSE */}
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-5 right-5 text-2xl"
              >
                ✕
              </button>

              {/* TITLE */}
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedPg?.Address}
              </h2>

              <p className="text-gray-500 mt-2">
                Enter new capacity
              </p>
              <div className="mt-6">

  <p className="text-sm text-gray-500 mb-3">
    Select Action
  </p>

  <div className="flex gap-4">

    {/* INCREASE */}
    <label
      className={`flex-1 border rounded-2xl p-4 cursor-pointer transition ${
        action === "increase"
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >

      <input
        type="radio"
        name="action"
        value="increase"
        checked={action === "increase"}
        onChange={(e) => setAction(e.target.value)}
        className="hidden"
      />

      <div className="flex items-center justify-center gap-2">

        <span className="text-xl">⬆️</span>

        <span className="font-semibold">
          Increase
        </span>

      </div>

    </label>

    {/* DECREASE */}
    <label
      className={`flex-1 border rounded-2xl p-4 cursor-pointer transition ${
        action === "decrease"
          ? "bg-red-500 text-white border-red-500"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >

      <input
        type="radio"
        name="action"
        value="decrease"
        checked={action === "decrease"}
        onChange={(e) => setAction(e.target.value)}
        className="hidden"
      />

      <div className="flex items-center justify-center gap-2">

        <span className="text-xl">⬇️</span>

        <span className="font-semibold">
          Decrease
        </span>

      </div>

    </label>

  </div>

</div>

              {/* INPUT */}
              <div className="mt-8">

                <label className="text-sm text-gray-500">
                  Capacity
                </label>

                <input 

                />
                <input
  type="number"
  placeholder="Enter capacity"
  value={capacity}
  onChange={(e) => setCapacity(e.target.value)}
  className="w-full mt-2 border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
/>

              </div>

              {/* BUTTON */}
              <button
                onClick={handleUpdate}
  className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
>
  Update Capacity
</button>

            </div>

          </div>

        )
      }

    </div>
  );
}

export default ManagePg;
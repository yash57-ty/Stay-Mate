import React, { useState } from 'react'

function PG() {
  const [form,setform]=useState({
    address:"",
    rent:"",
    city:"",
    renttype:"Student-wise",
    cpacity:"",
    gender:"girls",

  })
  const [bill,setbill]=useState(null)

  function handelchange(e){
    setform({...form,[e.target.name]:e.target.value})
  }

  
  function handelbill(e) {

    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("PDF must be less than 500 KB");
      return;
    }
    setbill(file);
  }

  function handelimages(e) {

  const files = Array.from(e.target.files);

    if (files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }
  
    for (let file of files) {
    if (file.size > 1024 * 1024) {

      alert(`${file.name} exceeds 1 MB`);
      return;
    }
  }
  setimages(files);
  }

  const [images,setimages]=useState([])

  async function handelsubmit(e){
     e.preventDefault();

     const data=new FormData();
     data.append("address",form.address)
     data.append("rent",form.rent)
     data.append("rentType",form.renttype)
     data.append("capacity",form.cpacity)
     data.append("city",form.city)
     data.append("gender",form.gender)
     data.append("phone",localStorage.getItem("userPhone"))

     images.forEach((e)=>{
      data.append("houseImages",e)
     })

     data.append("electricityBill",bill)
    
     
     try{
        const res=await fetch("http://localhost:8080/pg/add",{
          method:"POST",
          body:data,
          credentials:"include",
        });

        const result=await res.text();

        alert(result)
     }catch(err){
      console.log(err)
     }

  }
  return (

  <div className="h-screen overflow-hidden bg-[#F5F5F5] flex items-center justify-center p-3">

    <div className="w-full max-w-6xl h-[95vh] bg-white rounded-[2rem] shadow-xl p-5 flex flex-col overflow-hidden">

      {/* heading */}
      <div className="text-center mb-4">

        <h1 className="text-3xl font-black text-[#1A1D23]">
          Add PG
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Upload PG Details
        </p>

      </div>

      {/* form */}
      <form
        onSubmit={handelsubmit}
        className="grid grid-cols-2 gap-4 flex-1 overflow-hidden"
      >

        {/* Address */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            📍 Address
          </label>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handelchange}
            placeholder="Enter address"
            className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            🌆 City
          </label>

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handelchange}
            placeholder="Enter city"
            className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Rent */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            💰 Rent
          </label>

          <input
            type="number"
            name="rent"
            value={form.rent}
            onChange={handelchange}
            placeholder="Enter rent"
            className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            🛏️ Capacity
          </label>

          <input
            type="number"
            name="cpacity"
            value={form.cpacity}
            onChange={handelchange}
            placeholder="Enter capacity"
            className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Rent Type */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            🏠 Rent Type
          </label>

          <div className="flex gap-2">

            <label className={`flex-1 text-center py-2.5 rounded-xl border cursor-pointer transition ${
              form.renttype === "Student Wise"
                ? "bg-red-500 text-white border-red-500"
                : "bg-gray-50"
            }`}>

              <input
                type="radio"
                name="renttype"
                value="Student Wise"
                checked={form.renttype === "Student Wise"}
                onChange={handelchange}
                className="hidden"
              />

              👥 Student Wise

            </label>

            <label className={`flex-1 text-center py-2.5 rounded-xl border cursor-pointer transition ${
              form.renttype === "Full Home"
                ? "bg-red-500 text-white border-red-500"
                : "bg-gray-50"
            }`}>

              <input
                type="radio"
                name="renttype"
                value="Full Home"
                checked={form.renttype === "Full Home"}
                onChange={handelchange}
                className="hidden"
              />
              🏡 Full Home

            </label>

          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            🚻 Available For
          </label>

          <div className="flex gap-2">

            <label className={`flex-1 text-center py-2.5 rounded-xl border cursor-pointer transition ${
              form.gender === "boys"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-50"
            }`}>

              <input
                type="radio"
                name="gender"
                value="boys"
                checked={form.gender === "boys"}
                onChange={handelchange}
                className="hidden"
              />

              👦 Boys

            </label>

            <label className={`flex-1 text-center py-2.5 rounded-xl border cursor-pointer transition ${
              form.gender === "girls"
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-gray-50"
            }`}>

              <input
                type="radio"
                name="gender"
                value="girls"
                checked={form.gender === "girls"}
                onChange={handelchange}
                className="hidden"
              />
              👧 Girls
            </label>

          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            🏠 House Images
          </label>

          <div className="border-2 border-dashed rounded-xl p-2 bg-gray-50">

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handelimages}
              className="w-full text-sm"
            />

            <p className="text-xs text-gray-400 mt-1">
              Max 6 Images
            </p>

          </div>
        </div>

        {/* Electricity */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            ⚡ Electricity Bill
          </label>

          <div className="border-2 border-dashed rounded-xl p-2 bg-gray-50">

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handelbill}
              className="w-full text-sm"
            />

            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG or PDF
            </p>

          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="col-span-2 mt-2 bg-[#FF4757] hover:bg-[#ff3041] text-white py-3 rounded-xl font-bold transition"
        >
          🚀 Upload PG
        </button>

      </form>

    </div>

  </div>

);
}

export default PG

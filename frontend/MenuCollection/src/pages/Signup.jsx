import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    email: "",
    role:false,
    gender:"male"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    const res = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Signup failed");
      return;
    }

    navigate("/login");
  };

  function handelchecked(e){
    console.log("hello")
    setForm({...form,[e.target.name]:e.target.checked});
  }
  function handelchange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 py-10 text-[#1A1D23]">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.05)] p-10">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

  <input
    name="name"
    type="text"
    value={form.name}
    placeholder="Your Name"
    onChange={handelchange}
    required
    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4757]/20 focus:border-[#FF4757] transition-all placeholder:text-gray-400"
  />

  <input
    name="phone"
    type="text"
    required
    value={form.phone}
    placeholder="Phone No."
    onChange={handelchange}
    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4757]/20 focus:border-[#FF4757] transition-all placeholder:text-gray-400"
  />

  <input
    name="password"
    type="password"
    required
    value={form.password}
    placeholder="Password"
    onChange={handelchange}
    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4757]/20 focus:border-[#FF4757] transition-all placeholder:text-gray-400"
  />

  <input
    name="email"
    type="email"
    value={form.email}
    placeholder="Email"
    required
    onChange={handelchange}
    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4757]/20 focus:border-[#FF4757] transition-all placeholder:text-gray-400"
  />

  <label className="flex items-center gap-3 px-2 text-gray-700 font-medium">

    <input
      name="role"
      type="checkbox"
      checked={form.role}
      required
      onChange={handelchecked}
      className="w-5 h-5 accent-[#FF4757] rounded-md cursor-pointer"
    />

    <span>🏠 PG Owner</span>

  </label>
  <div>

  <label className="block mb-3 text-sm font-bold text-gray-700">
    🚻 Gender
  </label>

  <div className="flex gap-4">

    {/* Female */}
    <label
      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm ${
        form.gender === "female"
          ? "bg-pink-500 text-white border-pink-500 scale-105 shadow-pink-200"
          : "bg-white border-gray-200 hover:border-pink-300"
      }`}
    >

      <input
        name="gender"
        type="radio"
        checked={form.gender === "female"}
        value="female"
        onChange={handelchange}
        className="hidden"
      />

      <span className="text-2xl">👩</span>

      <span className="font-semibold text-lg">
        Female
      </span>

    </label>

    {/* Male */}
    <label
      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm ${
        form.gender === "male"
          ? "bg-blue-500 text-white border-blue-500 scale-105 shadow-blue-200"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >

      <input
        name="gender"
        type="radio"
        checked={form.gender === "male"}
        value="male"
        onChange={handelchange}
        className="hidden"
      />

      <span className="text-2xl">👨</span>

      <span className="font-semibold text-lg">
        Male
      </span>

    </label>

  </div>

</div>

  <button
    type="submit"
    className="w-full bg-[#FF4757] hover:bg-[#ff3041] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 active:scale-95 transition-all mt-4"
  >
    Create Account
  </button>

</form>

        <p className="text-center mt-10 text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#1A1D23] font-black underline underline-offset-4"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
import { useEffect, useState } from "react";

export default function MenuPhotosModal({
    isOpen,
    menuStoreId,
    restaurantName,
    onClose,
}) {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !menuStoreId) return;

        const fetchDishes = async () => {
            setLoading(true);

            try {
                const res = await fetch(
                    `http://localhost:8080/api/ai-menu/menu/${menuStoreId}/dishes`,
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to load menu photos");
                }

                const data = await res.json();
                setDishes(data);

            } catch (err) {
                console.error("Menu photos error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();

    }, [isOpen, menuStoreId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b">

                    <div>
                        <h2 className="text-xl font-bold">
                            Menu Photos
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {restaurantName}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl"
                    >
                        ×
                    </button>

                </div>

                {/* CONTENT */}
                <div className="p-6 overflow-y-auto max-h-[75vh]">

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">
                            Loading menu photos...
                        </div>
                    ) : dishes.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No dishes found for this menu.
                        </div>
                    ) : (

                        <div className="space-y-6">

                            {dishes.map((dish, index) => (

                                <div
                                    key={dish.id}
                                    className="bg-gray-50 rounded-2xl overflow-hidden"
                                >

                                    {/* IMAGE */}
                                    {dish.imageUrl ? (
                                        <img
                                            src={dish.imageUrl}
                                            alt={dish.name}
                                            className="w-full h-56 sm:h-72 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-56 sm:h-72 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">
                                                Image processing...
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-4">

                                        <p className="text-xs text-gray-400 font-semibold">
                                            {index + 1}
                                        </p>

                                        <h3 className="text-lg font-bold text-gray-800">
                                            {dish.name}
                                        </h3>

                                        {dish.gujaratiName && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {dish.gujaratiName}
                                            </p>
                                        )}

                                        {dish.category && (
                                            <span className="inline-block mt-2 px-3 py-1 bg-white rounded-full text-xs text-gray-500">
                                                {dish.category}
                                            </span>
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}
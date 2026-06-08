import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function QuantityInput({
  min = 0,
  max = 10,
  value = 1,
  onChange,
}) {
  const [qty, setQty] = useState(value);

  const handleChange = (newQty) => {
    if (newQty < min) newQty = min;
    if (newQty > max) newQty = max;
    setQty(newQty);
    if (onChange) onChange(newQty);
  };

  return (
    <div className="flex w-28 items-center overflow-hidden rounded-md border">
      <button
        className="flex h-10 w-10 items-center justify-center border-r disabled:opacity-50"
        onClick={() => handleChange(qty - 1)}
        disabled={qty <= min}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        className="w-full text-center outline-none"
        value={qty}
        onChange={(e) => handleChange(parseInt(e.target.value) || min)}
        min={min}
        max={max}
      />
      <button
        className="flex h-10 w-10 items-center justify-center border-l disabled:opacity-50"
        onClick={() => handleChange(qty + 1)}
        disabled={qty >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

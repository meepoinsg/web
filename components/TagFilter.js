"use client";

export default function TagFilter({ options, active, onChange }) {
  return (
    <div className="filters-scroll flex gap-2 overflow-x-auto pb-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-shrink-0 whitespace-nowrap text-[13px] px-3.5 py-1.5 rounded-full border ${
            active === opt
              ? "bg-accent text-white border-accent"
              : "bg-white text-gray-500 border-[var(--line)]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

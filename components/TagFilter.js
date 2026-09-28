"use client";

// options: [{ key, label }]，active/onChange 都是用 key（不是显示文字），
// 这样中英文切换的时候筛选状态不会跟着丢
export default function TagFilter({ options, active, onChange }) {
  return (
    <div className="filters-scroll flex gap-2 overflow-x-auto pb-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`flex-shrink-0 whitespace-nowrap text-[13px] px-3.5 py-1.5 rounded-full border ${
            active === opt.key
              ? "bg-accent text-white border-accent"
              : "bg-white text-gray-500 border-[var(--line)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

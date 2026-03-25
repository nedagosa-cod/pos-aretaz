import { segmentsConfig } from "../../data/products";

type Props = {
  selectedSegment: string;
  setSelectedSegment: (segment: string) => void;
  setSelectedCategory: (category: string | null) => void;
};

export function SegmentSwitcher({ selectedSegment, setSelectedSegment, setSelectedCategory }: Props) {
  return (
    <div className="bg-[#FFF4E0] py-3 px-4 flex justify-center gap-6 overflow-x-auto scrollbar-hide shrink-0 shadow-sm z-10 w-full overflow-hidden">
      {segmentsConfig.map(seg => (
        <button
          key={seg.id}
          onClick={() => { setSelectedSegment(seg.id); setSelectedCategory(null); }}
          className="flex items-center justify-center group transition-all"
          title={seg.id}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all shadow-sm ${selectedSegment === seg.id ? "bg-[#BA4146] text-neutral-900 scale-110 shadow-[0_4px_12px_rgba(202,168,78,0.4)] ring-4 ring-brand-secondary/20" : "bg-white text-[#D49826] hover:bg-[#FCE6BD] hover:text-[#B57C15] group-hover:-translate-y-1"}`}>
            {seg.icon}
          </div>
        </button>
      ))}
    </div>
  );
}

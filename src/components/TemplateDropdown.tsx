import { useState } from "react";
import { ChevronDown, LayoutTemplate } from "lucide-react";

interface Template {
  name: string;
  labels: string[];
}

const TEMPLATES: Template[] = [
  {
    name: "Solopreneur Startup",
    labels: ["Product", "Marketing", "Sales", "Finance", "Network", "Skills", "Systems", "Mindset"],
  },
  {
    name: "Wealth Building",
    labels: ["Income", "Savings", "Investing", "Assets", "Debt", "Budget", "Skills", "Network"],
  },
  {
    name: "Healthy Lifestyle",
    labels: ["Nutrition", "Exercise", "Sleep", "Mental", "Habits", "Social", "Medical", "Goals"],
  },
  {
    name: "Student Success",
    labels: ["Studies", "Projects", "Network", "Skills", "Health", "Finance", "Career", "Balance"],
  },
  {
    name: "Creative Career",
    labels: ["Craft", "Portfolio", "Clients", "Income", "Learning", "Network", "Brand", "Balance"],
  },
];

interface TemplateDropdownProps {
  onSelect: (labels: string[]) => void;
}

export function TemplateDropdown({ onSelect }: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (template: Template) => {
    onSelect(template.labels);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pixel-button flex items-center gap-2 font-pixel text-[8px] sm:text-[10px] text-muted-foreground hover:text-foreground ${isOpen ? 'pressed' : ''}`}
        style={{ imageRendering: 'pixelated' }}
      >
        <LayoutTemplate className="w-3.5 h-3.5" style={{ imageRendering: 'pixelated' }} />
        <span>Templates</span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} 
          style={{ imageRendering: 'pixelated' }}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div 
            className="absolute top-full right-0 mt-2 w-56 bg-popover border-2 border-border z-20 overflow-hidden animate-scale-in"
            style={{ 
              imageRendering: 'pixelated',
              boxShadow: 'inset -2px -2px 0 hsl(220 15% 8%), inset 2px 2px 0 hsl(220 15% 20%), 4px 4px 0 hsl(0 0% 0% / 0.3)'
            }}
          >
            <div className="p-1">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleSelect(template)}
                  className="w-full text-left px-3 py-2 font-pixel-mono text-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
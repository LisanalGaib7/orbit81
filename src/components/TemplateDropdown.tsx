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
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
      >
        <LayoutTemplate className="w-4 h-4" />
        <span>Templates</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden animate-scale-in">
            <div className="p-1">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleSelect(template)}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
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

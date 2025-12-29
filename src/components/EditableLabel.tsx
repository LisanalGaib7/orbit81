import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

interface EditableLabelProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}

export function EditableLabel({ value, onChange, className = "" }: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b border-dashed border-primary text-center outline-none text-muted-foreground ${className}`}
        maxLength={15}
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`group relative cursor-pointer hover:text-primary transition-colors text-center ${className}`}
      title="Click to edit"
    >
      <span className="border-b border-dashed border-transparent group-hover:border-muted-foreground transition-colors">
        {value}
      </span>
      <Pencil className="absolute -right-2 -top-1 w-2 h-2 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
    </button>
  );
}

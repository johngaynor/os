import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FieldInputProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  min?: number;
  max?: number;
  className?: string;
  description?: string;
  tooltip?: string;
}

export const FieldInput: React.FC<FieldInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  disabled = false,
  placeholder,
  type = "text",
  min,
  max,
  className = "",
  description,
  tooltip,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-1 min-h-[22px]">
        <Label className="block font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="w-4 h-4 flex items-center justify-center">
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        {...register}
      />
      {error && (
        <p className="text-destructive text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default FieldInput;

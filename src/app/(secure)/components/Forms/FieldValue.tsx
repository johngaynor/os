import React from "react";

export const FieldValue = ({
  title,
  value,
  className = "",
}: {
  title: string;
  value: string | number | null;
  className?: string;
}) => {
  return (
    <div className={className}>
      <p className="text-muted-foreground">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
};

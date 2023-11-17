"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface SearchProps {
  searchValue?: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function Search({
  searchValue = "",
  placeholder,
  onChange,
}: SearchProps) {
  const [value, setValue] = React.useState(searchValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
    />
  );
}

import React from "react";
import { Check, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function SearchFilters({ filters, onFilterChange }) {
  const genres = [
    "POP/CONTEMPORARY POP",
    "POP-ROCK/ALTERNATIVE", 
    "R&B/SOUL", 
    "ELECTRONIC/DANCE POP", 
    "HIP-HOP/RAP",
    "INDIE POP", 
    "REGGAE",
    "ROCK",
    "COUNTRY",
    "CLASSICAL"
  ];
  
  const tags = [
    "Producer", 
    "Songwriter", 
    "Vocalist", 
    "Instrumentalist", 
    "Engineer", 
    "Lyricist",
    "Guitarist",
    "Pianist",
    "Drummer",
    "Violinist",
    "Cellist",
    "Mixing Engineer",
    "Mastering Engineer"
  ];
  
  const tiers = ["A", "B", "C"];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="font-medium">Filters</h3>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block text-gray-600">Genre</label>
          <Select value={filters.genre} onValueChange={(value) => onFilterChange("genre", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block text-gray-600">Tier</label>
          <Select value={filters.tier} onValueChange={(value) => onFilterChange("tier", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {tiers.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  Tier {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block text-gray-600">Skills</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter((t) => t !== tag)
                    : [...filters.tags, tag];
                  onFilterChange("tags", newTags);
                }}
              >
                {filters.tags.includes(tag) && <Check className="w-3 h-3 mr-1" />}
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
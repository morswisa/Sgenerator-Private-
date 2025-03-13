
import React, { useState, useEffect } from "react";
import { Artist } from "@/entities/Artist";
import { Input } from "@/components/ui/input";
import { Search, Music } from "lucide-react";
import ArtistCard from "../components/artists/ArtistCard";
import SearchFilters from "../components/search/SearchFilters";

export default function ExplorePage() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    genre: "all",
    tier: "all",
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    setIsLoading(true);
    try {
      const data = await Artist.list();
      // Remove duplicates by name
      const uniqueArtists = data.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          // If we find a duplicate, keep the one with more information
          const currentInfoCount = Object.keys(current).filter(key => current[key]).length;
          const existingInfoCount = Object.keys(x).filter(key => x[key]).length;
          if (currentInfoCount > existingInfoCount) {
            return acc.map(item => item.name === current.name ? current : item);
          }
          return acc;
        }
      }, []);
      
      setArtists(uniqueArtists);
    } catch (error) {
      console.error("Error loading artists:", error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = 
      (artist.name && artist.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (artist.location && artist.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = filters.genre === "all" || 
      (artist.primary_genre && artist.primary_genre === filters.genre) ||
      (artist.genres && artist.genres.includes(filters.genre));
      
    const matchesTier = filters.tier === "all" || artist.tier === filters.tier;
    
    const matchesTags = filters.tags.length === 0 || 
      (artist.tags && filters.tags.every(tag => artist.tags.includes(tag)));

    return matchesSearch && matchesGenre && matchesTier && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Find Music Industry Professionals</h1>
          <p className="text-gray-500 mt-2">Connect with top producers, songwriters, and artists worldwide</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="search"
            placeholder="Search by name or location..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    {filteredArtists.length} {filteredArtists.length === 1 ? 'professional' : 'professionals'} found
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

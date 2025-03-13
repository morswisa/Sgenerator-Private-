import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Mail, Star, Music, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const tierColors = {
  A: "bg-blue-100 text-blue-800",
  B: "bg-green-100 text-green-800",
  C: "bg-yellow-100 text-yellow-800"
};

const tierLabels = {
  A: "Award Winning / 1B+ Streams",
  B: "Established / 1M+ Streams",
  C: "Emerging Artist"
};

export default function ArtistCard({ artist }) {
  const hasContactInfo = artist.contact && artist.contact.trim() !== "";
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{artist.name}</CardTitle>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{artist.location || "Location unknown"}</span>
            </div>
          </div>
          <Badge className={tierColors[artist.tier]}>
            <Star className="w-3 h-3 mr-1" />
            {artist.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {artist.primary_genre && (
              <Badge variant="outline" className="bg-gray-50">
                <Music className="w-3 h-3 mr-1" />
                {artist.primary_genre}
              </Badge>
            )}
            {artist.genres?.slice(0, 2).map((genre, i) => (
              <Badge key={i} variant="outline" className="bg-gray-50">
                {genre}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {artist.tags?.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {artist.nvak_artist && (
            <Badge className="bg-purple-100 text-purple-800">Nvak Artist</Badge>
          )}

          <div className="flex justify-between items-center pt-4">
            {artist.portfolio_links?.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <a href={artist.portfolio_links[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </a>
              </Button>
            )}
            <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full">
              <Link to={`/ArtistProfile/${artist.id}`} className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                View Contact Info
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
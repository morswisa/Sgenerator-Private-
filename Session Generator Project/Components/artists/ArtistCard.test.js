import React from 'react';
import { render, screen } from '@testing-library/react';
import ArtistCard from './ArtistCard';

test('renders ArtistCard component', () => {
    render(<ArtistCard />);
    const linkElement = screen.getByText(/artist name/i);
    expect(linkElement).toBeInTheDocument();
});

test('handles props correctly', () => {
    const artist = { name: 'Test Artist', genre: 'Rock' };
    render(<ArtistCard artist={artist} />);
    expect(screen.getByText(/Test Artist/i)).toBeInTheDocument();
    expect(screen.getByText(/Rock/i)).toBeInTheDocument();
});
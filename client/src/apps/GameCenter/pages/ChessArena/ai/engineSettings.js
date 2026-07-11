/**
 * Engine Personalities mapping to Stockfish Skill Levels and Search Depths.
 * Stockfish skill level ranges from 0 to 20.
 */

export const ENGINE_PERSONALITIES = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    skillLevel: 0,
    depth: 2,
    moveTime: 500, // Ms to think (makes it feel human)
    style: 'Makes intentional mistakes',
  },
  casual: {
    id: 'casual',
    name: 'Casual',
    skillLevel: 5,
    depth: 5,
    moveTime: 1000,
    style: 'Human-like play',
  },
  club: {
    id: 'club',
    name: 'Club Player',
    skillLevel: 10,
    depth: 10,
    moveTime: 1500,
    style: 'Balanced',
  },
  tactical: {
    id: 'tactical',
    name: 'Tactical',
    skillLevel: 15,
    depth: 12,
    moveTime: 2000,
    style: 'Aggressive attacks',
  },
  positional: {
    id: 'positional',
    name: 'Positional',
    skillLevel: 15, // Skill 15 but we can tweak parameters if we send UCI options like Contempt
    depth: 14,
    moveTime: 2000,
    style: 'Strategic maneuvering',
  },
  master: {
    id: 'master',
    name: 'Master',
    skillLevel: 20,
    depth: 18,
    moveTime: 3000,
    style: 'Strong engine play',
  }
};

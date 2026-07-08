import GameCard from './GameCard';

export default function HorizontalScrollRow({ title, games, onSelectGame }) {
  if (!games || games.length === 0) return null;

  return (
    <div className="gc-row">
      <h3>{title}</h3>
      <div className="gc-row-scroll">
        {games.map(game => (
          <GameCard key={game.id} game={game} onClick={onSelectGame} />
        ))}
      </div>
    </div>
  );
}

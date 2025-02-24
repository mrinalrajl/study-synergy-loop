
import { Trophy, Medal, Award } from "lucide-react";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  score: number;
  rank: number;
}

export const Leaderboard = () => {
  const [users] = useState<User[]>([
    { id: 1, name: "Alex Thompson", score: 2500, rank: 1 },
    { id: 2, name: "Maria Garcia", score: 2350, rank: 2 },
    { id: 3, name: "John Smith", score: 2200, rank: 3 },
    { id: 4, name: "Sarah Wilson", score: 2100, rank: 4 },
    { id: 5, name: "David Lee", score: 2000, rank: 5 },
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
      <div className="px-6 py-4 bg-primary">
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 text-center font-semibold">
                {getRankIcon(user.rank) || `#${user.rank}`}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.score} points</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

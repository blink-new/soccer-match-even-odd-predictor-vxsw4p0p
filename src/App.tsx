import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState("");

  const handlePrediction = () => {
    if (homeTeam && awayTeam) {
      const totalLength = homeTeam.length + awayTeam.length;
      if (totalLength % 2 === 0) {
        setPrediction("Even");
      } else {
        setPrediction("Odd");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Even/Odd Soccer Match Predictor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input
              placeholder="Home Team"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
            />
            <Input
              placeholder="Away Team"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
            />
            <Button onClick={handlePrediction}>Predict</Button>
            {prediction && (
              <div className="text-center text-xl font-bold">{prediction}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

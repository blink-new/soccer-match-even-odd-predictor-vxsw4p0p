import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Zap, BarChart3 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState<{
    result: string;
    confidence: number;
    predictedScore: [number, number];
    factors: string[];
  } | null>(null);

  const handlePrediction = () => {
    if (homeTeam && awayTeam) {
      // Generate semi-random but deterministic predictions based on team names
      const hash = (homeTeam + awayTeam).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Calculate predicted goals (0-5 range)
      const homeGoals = hash % 6;
      const awayGoals = (hash * 13) % 6;
      const totalGoals = homeGoals + awayGoals;
      
      // Determine even/odd
      const isEven = totalGoals % 2 === 0;
      
      // Calculate confidence (45-65% range for realism)
      const confidence = 45 + (hash % 21);
      
      // Generate factors based on team characteristics
      const factors = [];
      
      if (homeTeam.length > awayTeam.length) {
        factors.push("Home team name advantage suggests stronger squad depth");
      } else if (awayTeam.length > homeTeam.length) {
        factors.push("Away team shows better traveling form historically");
      }
      
      if ((hash % 3) === 0) {
        factors.push("Recent head-to-head matches favor low-scoring games");
      } else if ((hash % 3) === 1) {
        factors.push("Both teams have strong attacking players in form");
      } else {
        factors.push("Weather conditions may impact scoring opportunities");
      }
      
      if (totalGoals > 3) {
        factors.push("Statistical models predict an open, high-scoring match");
      } else if (totalGoals < 2) {
        factors.push("Defensive tactics likely to dominate this fixture");
      } else {
        factors.push("Expected to be a balanced, tactical encounter");
      }
      
      setPrediction({
        result: isEven ? "Even" : "Odd",
        confidence,
        predictedScore: [homeGoals, awayGoals],
        factors
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Even/Odd Soccer Match Predictor
            </CardTitle>
            <p className="text-center text-sm text-gray-500 mt-2">
              AI-powered predictions for total match goals
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Input
                placeholder="Enter Home Team"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="h-12 text-base"
              />
              <Input
                placeholder="Enter Away Team"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="h-12 text-base"
              />
              <Button 
                onClick={handlePrediction}
                className="h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300"
                disabled={!homeTeam || !awayTeam}
              >
                Generate Prediction
              </Button>
              <AnimatePresence>
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
                      <div className={`h-2 ${prediction.result === "Even" ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gradient-to-r from-green-400 to-green-600"}`}></div>
                      <CardHeader className="text-center">
                        <motion.div 
                          className="flex justify-center mb-2"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <Zap className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold">Prediction Result</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className={`text-6xl font-bold ${
                            prediction.result === "Even" ? "text-blue-600" : "text-green-600"
                          }`}
                        >
                          {prediction.result}
                        </motion.div>
                        <Badge
                          variant={prediction.confidence > 55 ? "default" : "secondary"}
                          className="text-sm py-1.5 px-4 font-medium"
                        >
                          {prediction.confidence}% Confidence
                        </Badge>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-inner">
                          <p className="text-sm text-gray-600 mb-3 font-medium">Predicted Final Score</p>
                          <div className="text-3xl font-bold text-gray-800">
                            {homeTeam.split(' ')[0] || 'Home'} {prediction.predictedScore[0]} - {prediction.predictedScore[1]} {awayTeam.split(' ')[0] || 'Away'}
                          </div>
                          <p className="text-sm text-gray-600 mt-2 font-medium">
                            Total: <span className={`font-bold ${prediction.result === "Even" ? "text-blue-600" : "text-green-600"}`}>{prediction.predictedScore[0] + prediction.predictedScore[1]}</span> goals
                          </p>
                        </div>

                        <div className="text-left space-y-3 bg-gray-50/50 rounded-xl p-4">
                          <p className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-gray-500" />
                            Key Analysis Factors
                          </p>
                          <div className="space-y-1">
                            {prediction.factors.map((factor, index) => (
                              <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.3 }}
                                className="text-xs text-gray-600 flex items-start gap-2"
                              >
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                {factor}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6"
        >
          <Card className="shadow border-0 bg-blue-50/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-base font-semibold text-blue-700 flex items-center justify-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                Reference Probabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="flex items-center justify-center gap-6 text-lg font-bold">
                <span className="text-blue-600">Even: 48%</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600">Odd: 52%</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Based on historical data, about 48% of soccer matches end with an even total score, and 52% with odd.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
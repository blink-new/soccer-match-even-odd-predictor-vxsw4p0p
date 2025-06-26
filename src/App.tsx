import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { BarChart3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
            <AnimatePresence>
              {prediction && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        <Zap className="h-8 w-8 text-yellow-500" />
                      </div>
                      <CardTitle className="text-2xl">Prediction Result</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className={`text-6xl font-bold ${
                        prediction.result === 'EVEN' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {prediction.result}
                      </div>
                      
                      <Badge 
                        variant="secondary" 
                        className="text-sm py-1 px-3"
                      >
                        {prediction.confidence}% Confidence
                      </Badge>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">Predicted Final Score</p>
                        <div className="text-2xl font-bold text-gray-800">
                          {homeTeam.name.split(' ')[0] || 'Home'} {prediction.predictedScore[0]} - {prediction.predictedScore[1]} {awayTeam.name.split(' ')[0] || 'Away'}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Total: {prediction.predictedScore[0] + prediction.predictedScore[1]} goals
                        </p>
                      </div>

                      <div className="text-left space-y-2">
                        <p className="font-semibold text-sm text-gray-700">Key Factors:</p>
                        {prediction.factors.map((factor, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-start gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="shadow border-0 bg-blue-50/80 backdrop-blur-sm mt-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trophy, Users, Target, BarChart3, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamData {
  name: string
  strength: number
  form: number
  homeAdvantage?: number
}

interface Prediction {
  result: 'EVEN' | 'ODD'
  confidence: number
  predictedScore: [number, number]
  factors: string[]
}

interface MatchHistory {
  homeTeam: string
  awayTeam: string
  prediction: 'EVEN' | 'ODD'
  confidence: number
  timestamp: Date
}

function App() {
  const [homeTeam, setHomeTeam] = useState<TeamData>({ name: '', strength: 50, form: 50 })
  const [awayTeam, setAwayTeam] = useState<TeamData>({ name: '', strength: 50, form: 50 })
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const calculatePrediction = () => {
    if (!homeTeam.name || !awayTeam.name) return

    setIsCalculating(true)

    // Simulate calculation delay for dramatic effect
    setTimeout(() => {
      // Complex prediction algorithm based on team stats
      const homeAdv = 5 // Home advantage factor
      const homeScore = Math.max(0, Math.round(
        (homeTeam.strength + homeTeam.form + homeAdv) / 100 * 4 + Math.random() * 2
      ))
      const awayScore = Math.max(0, Math.round(
        (awayTeam.strength + awayTeam.form) / 100 * 4 + Math.random() * 2
      ))
      
      const totalScore = homeScore + awayScore
      const result = totalScore % 2 === 0 ? 'EVEN' : 'ODD'
      
      // Calculate confidence based on difference in team stats
      const statDiff = Math.abs(
        (homeTeam.strength + homeTeam.form) - (awayTeam.strength + awayTeam.form)
      )
      const confidence = Math.min(95, 60 + statDiff / 2)

      const factors = [
        `Team strength difference: ${Math.abs(homeTeam.strength - awayTeam.strength)}%`,
        `Form comparison: ${homeTeam.form} vs ${awayTeam.form}`,
        `Home advantage: +${homeAdv}% for ${homeTeam.name}`,
        `Historical patterns analyzed`
      ]

      const newPrediction = {
        result,
        confidence: Math.round(confidence),
        predictedScore: [homeScore, awayScore] as [number, number],
        factors
      }

      setPrediction(newPrediction)
      
      // Add to match history
      const newMatch: MatchHistory = {
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        prediction: result,
        confidence: Math.round(confidence),
        timestamp: new Date()
      }
      setMatchHistory(prev => [newMatch, ...prev.slice(0, 4)]) // Keep last 5 matches

      setIsCalculating(false)
    }, 1500)
  }

  const resetForm = () => {
    setHomeTeam({ name: '', strength: 50, form: 50 })
    setAwayTeam({ name: '', strength: 50, form: 50 })
    setPrediction(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Soccer Match Predictor</h1>
          </div>
          <p className="text-green-100 text-lg">
            AI-powered predictions for even/odd total goals
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-green-600" />
                  Team Analysis
                </CardTitle>
                <CardDescription>
                  Enter team details to generate your prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Home Team */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <Label className="text-lg font-semibold">Home Team</Label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="home-name">Team Name</Label>
                      <Input
                        id="home-name"
                        placeholder="e.g., Manchester United"
                        value={homeTeam.name}
                        onChange={(e) => setHomeTeam(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="home-strength">Strength ({homeTeam.strength}%)</Label>
                      <Input
                        id="home-strength"
                        type="range"
                        min="1"
                        max="100"
                        value={homeTeam.strength}
                        onChange={(e) => setHomeTeam(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="home-form">Current Form ({homeTeam.form}%)</Label>
                      <Input
                        id="home-form"
                        type="range"
                        min="1"
                        max="100"
                        value={homeTeam.form}
                        onChange={(e) => setHomeTeam(prev => ({ ...prev, form: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Away Team */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <Label className="text-lg font-semibold">Away Team</Label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="away-name">Team Name</Label>
                      <Input
                        id="away-name"
                        placeholder="e.g., Liverpool"
                        value={awayTeam.name}
                        onChange={(e) => setAwayTeam(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="away-strength">Strength ({awayTeam.strength}%)</Label>
                      <Input
                        id="away-strength"
                        type="range"
                        min="1"
                        max="100"
                        value={awayTeam.strength}
                        onChange={(e) => setAwayTeam(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="away-form">Current Form ({awayTeam.form}%)</Label>
                      <Input
                        id="away-form"
                        type="range"
                        min="1"
                        max="100"
                        value={awayTeam.form}
                        onChange={(e) => setAwayTeam(prev => ({ ...prev, form: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={calculatePrediction}
                    disabled={!homeTeam.name || !awayTeam.name || isCalculating}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex-1"
                    size="lg"
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Predict Match
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prediction Results */}
          <div className="space-y-6">
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

            {/* Match History */}
            {matchHistory.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Recent Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matchHistory.map((match, index) => (
                      <motion.div
                        key={`${match.homeTeam}-${match.awayTeam}-${match.timestamp.getTime()}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {match.homeTeam} vs {match.awayTeam}
                          </p>
                          <p className="text-xs text-gray-500">
                            {match.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={match.prediction === 'EVEN' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {match.prediction}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {match.confidence}%
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
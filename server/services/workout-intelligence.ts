// server/services/workout-intelligence.ts
// New service for intelligent workout management

import { db } from '../db';
import { workouts } from '../schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { geminiHelper } from '../helpers/gemini';

export class WorkoutIntelligenceService {
  // Analyze workout patterns and suggest categories
  async analyzeUserPatterns(userId: string) {
    // Get user's workout history
    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.createdAt))
      .limit(50);

    // Analyze patterns
    const patterns = {
      preferredDifficulty: this.getMostCommonDifficulty(userWorkouts),
      averageDuration: this.getAverageDuration(userWorkouts),
      favoriteTypes: this.getFavoriteWorkoutTypes(userWorkouts),
      workoutFrequency: this.calculateFrequency(userWorkouts),
      muscleGroupFocus: this.getMuscleGroupDistribution(userWorkouts),
      timePreferences: this.getTimePreferences(userWorkouts)
    };

    return patterns;
  }

  // Smart categorization based on content analysis
  async categorizeWorkout(workout: any) {
    const categories = {
      primary: '',
      secondary: [],
      intensity: '',
      equipment: [],
      targetAudience: '',
      timeOfDay: ''
    };

    // Analyze workout content
    const exerciseText = JSON.stringify(workout.metadata?.exercises || {}).toLowerCase();
    
    // Determine primary category
    if (exerciseText.includes('squat') || exerciseText.includes('deadlift')) {
      categories.primary = 'strength-training';
    } else if (exerciseText.includes('run') || exerciseText.includes('jump')) {
      categories.primary = 'cardio';
    } else if (exerciseText.includes('yoga') || exerciseText.includes('stretch')) {
      categories.primary = 'flexibility';
    } else if (exerciseText.includes('burpee') && exerciseText.includes('sprint')) {
      categories.primary = 'hiit';
    }

    // Determine intensity
    const exerciseCount = (workout.metadata?.exercises?.main || []).length;
    const restPeriods = (exerciseText.match(/rest/g) || []).length;
    
    if (workout.difficulty === 'beginner' || restPeriods > exerciseCount * 0.8) {
      categories.intensity = 'low';
    } else if (workout.difficulty === 'advanced' || restPeriods < exerciseCount * 0.3) {
      categories.intensity = 'high';
    } else {
      categories.intensity = 'moderate';
    }

    // Detect equipment
    const equipmentKeywords = {
      'dumbbell': 'dumbbells',
      'barbell': 'barbell',
      'resistance band': 'bands',
      'kettlebell': 'kettlebell',
      'pull-up bar': 'pull-up-bar',
      'mat': 'yoga-mat'
    };

    for (const [keyword, equipment] of Object.entries(equipmentKeywords)) {
      if (exerciseText.includes(keyword)) {
        categories.equipment.push(equipment);
      }
    }

    if (categories.equipment.length === 0) {
      categories.equipment.push('bodyweight');
    }

    // Determine best time of day
    if (categories.primary === 'yoga' || categories.intensity === 'low') {
      categories.timeOfDay = 'evening';
    } else if (categories.primary === 'hiit' || categories.intensity === 'high') {
      categories.timeOfDay = 'morning';
    } else {
      categories.timeOfDay = 'anytime';
    }

    // Target audience
    if (workout.difficulty === 'beginner' && categories.intensity === 'low') {
      categories.targetAudience = 'beginners';
    } else if (workout.difficulty === 'advanced' && categories.intensity === 'high') {
      categories.targetAudience = 'athletes';
    } else {
      categories.targetAudience = 'intermediate';
    }

    return categories;
  }

  // Suggest workouts based on user patterns and goals
  async getSmartRecommendations(userId: string) {
    const patterns = await this.analyzeUserPatterns(userId);
    const lastWorkout = await this.getLastWorkout(userId);
    
    const recommendations = {
      nextWorkout: null,
      weeklyPlan: [],
      improvementAreas: [],
      challenges: []
    };

    // Determine next workout based on muscle recovery
    const lastMuscleGroups = lastWorkout?.targetMuscleGroups || [];
    const availableMuscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
      .filter(mg => !lastMuscleGroups.includes(mg));

    // Use AI to generate personalized recommendation
    const prompt = `Based on user's workout patterns:
    - Preferred difficulty: ${patterns.preferredDifficulty}
    - Average duration: ${patterns.averageDuration} minutes
    - Favorite types: ${patterns.favoriteTypes.join(', ')}
    - Last workout targeted: ${lastMuscleGroups.join(', ')}
    
    Recommend the next workout focusing on: ${availableMuscleGroups.join(', ')}
    
    Return a JSON object with:
    {
      "recommendation": "specific workout suggestion",
      "reasoning": "why this workout",
      "duration": number,
      "difficulty": "beginner|intermediate|advanced",
      "focus": ["muscle groups"]
    }`;

    try {
      const aiResponse = await geminiHelper.generateContent(prompt);
      const recommendation = JSON.parse(aiResponse);
      recommendations.nextWorkout = recommendation;
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Fallback recommendation
      recommendations.nextWorkout = {
        recommendation: `${patterns.averageDuration}-minute ${availableMuscleGroups[0]} workout`,
        reasoning: 'Muscle group rotation for optimal recovery',
        duration: patterns.averageDuration,
        difficulty: patterns.preferredDifficulty,
        focus: availableMuscleGroups.slice(0, 2)
      };
    }

    // Generate weekly plan
    recommendations.weeklyPlan = this.generateWeeklyPlan(patterns);

    // Identify improvement areas
    recommendations.improvementAreas = this.identifyImprovementAreas(patterns);

    return recommendations;
  }

  // Auto-archive old workouts
  async autoArchiveWorkouts(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find workouts that haven't been used in 30 days
    const oldWorkouts = await db
      .select()
      .from(workouts)
      .where(and(
        eq(workouts.userId, userId),
        gte(workouts.createdAt, thirtyDaysAgo)
      ));

    const toArchive = oldWorkouts.filter(w => {
      const lastCompleted = w.analytics?.lastCompleted;
      if (!lastCompleted) return true;
      
      const lastCompletedDate = new Date(lastCompleted);
      return lastCompletedDate < thirtyDaysAgo;
    });

    // Update workouts to archived status
    for (const workout of toArchive) {
      await db
        .update(workouts)
        .set({
          metadata: {
            ...workout.metadata,
            archived: true,
            archivedAt: new Date().toISOString()
          }
        })
        .where(eq(workouts.id, workout.id));
    }

    return toArchive.length;
  }

  // Helper methods
  private getMostCommonDifficulty(workouts: any[]) {
    const counts = workouts.reduce((acc, w) => {
      acc[w.difficulty] = (acc[w.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'intermediate';
  }

  private getAverageDuration(workouts: any[]) {
    const sum = workouts.reduce((acc, w) => acc + (w.duration || 30), 0);
    return Math.round(sum / workouts.length) || 30;
  }

  private getFavoriteWorkoutTypes(workouts: any[]) {
    const types = {};
    workouts.forEach(w => {
      (w.tags || []).forEach(tag => {
        types[tag] = (types[tag] || 0) + 1;
      });
    });
    
    return Object.entries(types)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  private calculateFrequency(workouts: any[]) {
    if (workouts.length < 2) return 'new-user';
    
    const dates = workouts
      .map(w => new Date(w.createdAt))
      .sort((a, b) => b - a);
    
    const daysBetween = [];
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i-1] - dates[i]) / (1000 * 60 * 60 * 24);
      daysBetween.push(diff);
    }
    
    const avgDays = daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length;
    
    if (avgDays < 2) return 'daily';
    if (avgDays < 4) return 'regular';
    if (avgDays < 8) return 'weekly';
    return 'occasional';
  }

  private getMuscleGroupDistribution(workouts: any[]) {
    const distribution = {};
    workouts.forEach(w => {
      (w.targetMuscleGroups || []).forEach(mg => {
        distribution[mg] = (distribution[mg] || 0) + 1;
      });
    });
    return distribution;
  }

  private getTimePreferences(workouts: any[]) {
    // This would analyze when workouts are typically completed
    // For now, return a simple default
    return {
      preferredTime: 'morning',
      averageStartTime: '08:00'
    };
  }

  private async getLastWorkout(userId: string) {
    const [last] = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.createdAt))
      .limit(1);
    
    return last;
  }

  private generateWeeklyPlan(patterns: any) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan = [];
    
    // Simple rotation based on patterns
    const workoutTypes = patterns.favoriteTypes.length > 0 
      ? patterns.favoriteTypes 
      : ['strength', 'cardio', 'flexibility'];
    
    days.forEach((day, index) => {
      if (index % 3 === 2) {
        plan.push({ day, type: 'rest', duration: 0 });
      } else {
        plan.push({
          day,
          type: workoutTypes[index % workoutTypes.length],
          duration: patterns.averageDuration,
          difficulty: patterns.preferredDifficulty
        });
      }
    });
    
    return plan;
  }

  private identifyImprovementAreas(patterns: any) {
    const areas = [];
    
    // Check muscle group balance
    const muscleGroups = patterns.muscleGroupFocus;
    const totalWorkouts = Object.values(muscleGroups).reduce((a, b) => a + b, 0);
    
    for (const [muscle, count] of Object.entries(muscleGroups)) {
      const percentage = (count / totalWorkouts) * 100;
      if (percentage < 10) {
        areas.push({
          area: muscle,
          message: `You've been neglecting ${muscle} workouts`,
          suggestion: `Add more ${muscle}-focused exercises`
        });
      }
    }
    
    // Check workout frequency
    if (patterns.workoutFrequency === 'occasional') {
      areas.push({
        area: 'consistency',
        message: 'Your workout frequency could be improved',
        suggestion: 'Try to maintain a more regular schedule'
      });
    }
    
    return areas;
  }
}

// Export singleton instance
export const workoutIntelligence = new WorkoutIntelligenceService();
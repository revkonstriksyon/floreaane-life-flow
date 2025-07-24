import express from "express";
import { 
  generateTimeSlotSuggestions, 
  analyzeProjectProgress, 
  generateWeeklyProgressSummary,
  generateSocialMediaCaptions 
} from "../services/gemini.js";

const router = express.Router();

// Get time slot suggestions based on mood and available time
router.post("/time-suggestions", async (req, res) => {
  try {
    const { mood, availableTime, currentHour, recentActivities, userContext } = req.body;
    
    const suggestions = await generateTimeSlotSuggestions(
      mood, 
      availableTime, 
      currentHour, 
      recentActivities || [], 
      userContext
    );
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting time suggestions:', error);
    res.status(500).json({ error: 'Failed to get AI suggestions' });
  }
});

// Analyze project progress and get recommendations
router.post("/project-analysis", async (req, res) => {
  try {
    const { project, tasks, recentActivity } = req.body;
    
    const analysis = await analyzeProjectProgress(project, tasks || [], recentActivity || []);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing project:', error);
    res.status(500).json({ error: 'Failed to analyze project' });
  }
});

// Generate weekly progress summary
router.post("/weekly-summary", async (req, res) => {
  try {
    const { completedTasks, projects, moodEntries } = req.body;
    
    const summary = await generateWeeklyProgressSummary(
      completedTasks || [], 
      projects || [], 
      moodEntries || []
    );
    
    res.json(summary);
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    res.status(500).json({ error: 'Failed to generate weekly summary' });
  }
});

// Generate social media captions
router.post("/social-media-captions", async (req, res) => {
  try {
    const { brand, recentPosts, daysSinceLastPost } = req.body;
    
    const captions = await generateSocialMediaCaptions(
      brand || 'REV', 
      recentPosts || [], 
      daysSinceLastPost || 0
    );
    
    res.json({ captions });
  } catch (error) {
    console.error('Error generating captions:', error);
    res.status(500).json({ error: 'Failed to generate captions' });
  }
});

export default router;
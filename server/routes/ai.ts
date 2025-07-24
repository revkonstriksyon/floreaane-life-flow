import express from 'express';
import { 
  generateTimeSlotSuggestions, 
  analyzeProjectProgress, 
  generateSocialMediaCaptions 
} from '../services/gemini';

const router = express.Router();

// Smart time suggestions based on mood and context
router.post('/time-suggestions', async (req, res) => {
  try {
    const { mood, availableTime, recentActivities, userContext } = req.body;
    
    const suggestions = await generateTimeSlotSuggestions(
      mood,
      availableTime,
      new Date().getHours(),
      recentActivities,
      userContext
    );
    
    res.json({ suggestions });
  } catch (error) {
    console.error('AI time suggestions error:', error);
    res.status(500).json({ 
      error: 'Pa ka jenere sijesyon yo kounye a',
      suggestions: []
    });
  }
});

// Project workflow analysis
router.post('/project-analysis', async (req, res) => {
  try {
    const { project, tasks, teamMembers } = req.body;
    
    const analysis = await analyzeProjectProgress(
      project,
      tasks,
      teamMembers
    );
    
    res.json({ analysis });
  } catch (error) {
    console.error('AI project analysis error:', error);
    res.status(500).json({ 
      error: 'Pa ka fè analiz la kounye a',
      analysis: {
        workflow: {},
        recommendations: [],
        insights: []
      }
    });
  }
});

// Social media caption generation
router.post('/social-media-captions', async (req, res) => {
  try {
    const { brand, recentPosts, daysSinceLastPost } = req.body;
    
    const captions = await generateSocialMediaCaptions(
      brand,
      recentPosts,
      daysSinceLastPost
    );
    
    res.json({ captions });
  } catch (error) {
    console.error('AI social media captions error:', error);
    res.status(500).json({ 
      error: 'Pa ka jenere caption yo kounye a',
      captions: []
    });
  }
});

// General AI assistant chat
router.post('/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;
    
    // For now, return a simple response in Haitian Creole
    const response = {
      message: `Mwen konprann ou vle konnen sou: "${message}". Mwen ap travay sou fonksyon sa a epi li ap disponib byento. Èske gen lòt bagay mwen ka ede ou ak li?`,
      suggestions: [
        "Planifye jou a",
        "Analiz pwojè yo",
        "Sijesyon tan",
        "Rezime semèn nan"
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      error: 'Pa ka reponn kounye a',
      message: 'Padon, mwen pa ka reponn kounye a. Eseye ankò.'
    });
  }
});

export default router;

const GEMINI_API_KEY = "AIzaSyBhmlobVRHKazQfZa6vFkVleFJTuKL-jng";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface AIResponse {
  text: string;
  suggestions?: string[];
}

export class GeminiAI {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Pa gen repons ki disponib";
    } catch (error) {
      console.error('Gemini API error:', error);
      return "Erè nan kominikasyon ak AI a";
    }
  }

  // AI suggestions for tasks
  static async getTaskSuggestions(tasks: any[]): Promise<AIResponse> {
    const prompt = `
    Kòm yon asistan pwodiktivite, analize tach sa yo epi ba m konsey:
    ${JSON.stringify(tasks.slice(0, 5), null, 2)}
    
    Bay konsey nan kreyòl ayisyen sou:
    1. Ki jan pou òganize tach yo pi byen
    2. Ki tach ki pi ijan
    3. Ki jan pou amelyore pwodiktivite a
    
    Repond nan kreyòl ayisyen ak 3-4 konsey kout yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }

  // AI suggestions for projects
  static async getProjectSuggestions(projects: any[]): Promise<AIResponse> {
    const prompt = `
    Analize pwojè sa yo epi ba m konsey:
    ${JSON.stringify(projects.slice(0, 3), null, 2)}
    
    Bay konsey nan kreyòl ayisyen sou:
    1. Ki jan pou jere pwojè yo pi byen
    2. Ki pwojè ki bezwen pi plis atansyon
    3. Ki jan pou rive nan objektif yo
    
    Repond nan kreyòl ayisyen ak konsey pratik yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }

  // AI suggestions for finances
  static async getFinancialSuggestions(transactions: any[]): Promise<AIResponse> {
    const prompt = `
    Analize tranzaksyon finansye sa yo:
    ${JSON.stringify(transactions.slice(0, 10), null, 2)}
    
    Bay konsey nan kreyòl ayisyen sou:
    1. Ki jan pou jere lajan pi byen
    2. Ki kote pou rezèv lajan
    3. Ki kategori depans ki pi wo
    
    Repond nan kreyòl ayisyen ak konsey finansye pratik yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }

  // AI suggestions for contacts/relationships
  static async getRelationshipSuggestions(contacts: any[]): Promise<AIResponse> {
    const prompt = `
    Analize kontak ak relasyon sa yo:
    ${JSON.stringify(contacts.slice(0, 5), null, 2)}
    
    Bay konsey nan kreyòl ayisyen sou:
    1. Ki jan pou kenbe bon relasyon
    2. Ki moun ki bezwen pi plis atansyon
    3. Ki jan pou devlope rezo sosyal la
    
    Repond nan kreyòl ayisyen ak konsey sou relasyon yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }

  // AI suggestions for assets
  static async getAssetSuggestions(assets: any[]): Promise<AIResponse> {
    const prompt = `
    Analize byen ak enventè sa yo:
    ${JSON.stringify(assets.slice(0, 5), null, 2)}
    
    Bay konsey nan kreyòl ayisyen sou:
    1. Ki jan pou pwoteje byen yo
    2. Ki bien ki bezwen pi plis atansyon
    3. Ki jan pou jere garanti ak maintenance
    
    Repond nan kreyòl ayisyen ak konsey pratik yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }

  // Generate content based on notes
  static async getContentSuggestions(notes: any[]): Promise<AIResponse> {
    const prompt = `
    Baze sou nòt sa yo, jenere nouvo ide ak konsey:
    ${JSON.stringify(notes.slice(0, 5), null, 2)}
    
    Bay ide nan kreyòl ayisyen sou:
    1. Nouvo sijè pou eksplore
    2. Koneksyon ant ide yo
    3. Aksyon pou pran baze sou enfòmasyon yo
    
    Repond nan kreyòl ayisyen ak ide kreyatif yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }

  // General AI assistant
  static async getGeneralAdvice(context: string): Promise<AIResponse> {
    const prompt = `
    Kòm yon asistan pèsonèl ak pwofesyonèl, bay konsey sou sitiyasyon sa a:
    ${context}
    
    Repond nan kreyòl ayisyen ak konsey pratik ak aksyon konkrè yo.
    `;

    const text = await this.makeRequest(prompt);
    return { text };
  }
}

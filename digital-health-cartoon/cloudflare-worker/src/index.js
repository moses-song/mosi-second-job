export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // YouTube news endpoint
    if (url.pathname === '/api/news/youtube' && request.method === 'GET') {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=health%20news&type=video&maxResults=10&key=${env.YOUTUBE_API_KEY}`);
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Health news endpoint using free RSS feed
    if (url.pathname === '/api/news/rss' && request.method === 'GET') {
      try {
        const response = await fetch('https://news.google.com/rss/topics/CAEQiogKMKsBAAAAAAAAAAAAAAAAAAg?hl=en-US&gl=US&ceid=US:en');
        const text = await response.text();
        
        return new Response(text, {
          headers: { ...corsHeaders, 'Content-Type': 'application/rss+xml' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Health cartoon generation endpoint
    if (url.pathname === '/api/cartoon/generate' && request.method === 'POST') {
      try {
        const { topic, audience, length } = await request.json();
        
        // Generate cartoon using free Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create a ${length}-scene educational cartoon about ${topic} for ${audience}. Include dialogue and scene descriptions. Format as JSON with scenes array.`
              }]
            }]
          })
        });

        const geminiResponse = await response.json();
        
        // Extract the JSON string from the response
        const jsonString = geminiResponse.candidates[0].content.parts[0].text;
        const cartoonData = JSON.parse(jsonString);

        // Create a structured cartoon response
        const cartoon = {
          id: Date.now().toString(),
          title: cartoonData.title,
          summary: cartoonData.summary,
          scenes: cartoonData.scenes,
          createdAt: new Date().toISOString(),
          sources: ['Google Gemini API']
        };
        
        return new Response(JSON.stringify(cartoon), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
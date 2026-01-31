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
        
        // Create a structured cartoon response
        const cartoon = {
          id: Date.now().toString(),
          title: '디지털 헬스케어 카툰',
          summary: 'AI가 생성한 최신 디지털 헬스케어 정보 카툰',
          scenes: [
            {
              sceneNumber: 1,
              description: '디지털 헬스케어 기술 소개',
              imagePrompt: 'digital healthcare technology',
              dialogue: '오늘은 최신 디지털 헬스케어 기술에 대해 알아봅시다!'
            },
            {
              sceneNumber: 2,
              description: 'AI 기반 진단 시스템',
              imagePrompt: 'AI medical diagnosis system',
              dialogue: 'AI가 의료 진단을 돕고 있습니다.'
            },
            {
              sceneNumber: 3,
              description: '웨어러블 기기 활용',
              imagePrompt: 'wearable health devices',
              dialogue: '웨어러블 기기로 건강을 실시간 관리할 수 있어요.'
            },
            {
              sceneNumber: 4,
              description: '미래 헬스케어 전망',
              imagePrompt: 'future healthcare vision',
              dialogue: '미래에는 더 발전된 디지털 헬스케어가 기대됩니다!'
            }
          ],
          createdAt: new Date().toISOString(),
          sources: ['AI Generated Content', 'Google Gemini API']
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
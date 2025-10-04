// For Cloudflare Workers - replace server.js with this
export default {
    async fetch(request, env, ctx) {
      // Handle CORS
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };
  
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }
  
      const url = new URL(request.url);
      
      if (url.pathname === '/weather') {
        try {
          const hkoUrl = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
          const response = await fetch(hkoUrl);
          const data = await response.json();
  
          const weatherSummary = {
            temperature: data.temperature?.data || [],
            rainfall: data.rainfall?.data || [],
            humidity: data.humidity?.data?.find(h => h.place === '香港天文台')?.value || data.humidity?.data?.[0]?.value || 'N/A',
            warningMessage: data.warningMessage || [],
            tcMessage: data.tcmessage || [],
            icon: data.icon?.[0] || 'N/A',
            updateTime: data.updateTime || 'N/A',
            rainfallTime: {
              startTime: data.rainfall?.startTime || 'N/A',
              endTime: data.rainfall?.endTime || 'N/A'
            }
          };
  
          return new Response(JSON.stringify(weatherSummary), {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            },
          });
        } catch (error) {
          console.error('Error fetching HKO data:', error.message);
          return new Response(JSON.stringify({ 
            error: 'Failed to fetch weather data', 
            details: error.message 
          }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            },
          });
        }
      }
  
      // Return 404 for other routes
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });
    }
  };
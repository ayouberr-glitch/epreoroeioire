// ... previous imports ...

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const { image, imageType, age, sex, language } = await req.json();

    // Add retry logic for the Gemini API call
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000; // 1 second

    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: imageType,
                      data: image
                    }
                  }
                ]
              }]
            })
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('Invalid response format from Gemini API');
        }

        // Process and return results
        const analysisText = result.candidates[0].content.parts[0].text;
        const testResults = parseAnalysisResults(analysisText);

        return new Response(
          JSON.stringify({ success: true, results: testResults }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        lastError = error;
        if (attempt < MAX_RETRIES - 1) {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, INITIAL_DELAY * Math.pow(2, attempt))
          );
          continue;
        }
        throw error;
      }
    }

    throw lastError;

  } catch (error) {
    console.error('Error in analyze-report function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        errorDetails: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function parseAnalysisResults(analysisText: string) {
  const testResults = [];
  const testBlocks = analysisText.split('\n\n');
  
  let currentResult = {};
  for (const block of testBlocks) {
    const lines = block.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('Test Name: ')) {
        if (Object.keys(currentResult).length > 0) {
          testResults.push(currentResult);
          currentResult = {};
        }
        currentResult.name = line.replace('Test Name: ', '').trim();
      } else if (line.startsWith('Value: ')) {
        currentResult.value = line.replace('Value: ', '').trim();
      } else if (line.startsWith('Reference Range: ')) {
        currentResult.range = line.replace('Reference Range: ', '').trim();
      } else if (line.startsWith('Status: ')) {
        currentResult.status = line.replace('Status: ', '').trim();
      } else if (line.startsWith('Advice: ')) {
        currentResult.advice = line.replace('Advice: ', '').trim();
      } else if (currentResult.advice) {
        currentResult.advice += '\n' + line;
      }
    }
  }
  
  if (Object.keys(currentResult).length > 0) {
    testResults.push(currentResult);
  }

  return testResults;
}
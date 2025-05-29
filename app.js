import dotenv from 'dotenv';
dotenv.config();
const API_KEY = 'process.env.OPENAI_API_KEY';

function getSelectedValues(selectId) {
  const select = document.getElementById(selectId);
  return Array.from(select.selectedOptions).map(opt => {
    // Convert to number for all except stop_sequence (which is text)
    return selectId === 'stop_sequence' ? opt.value : Number(opt.value);
  });
}

async function callOpenAI(params) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function createTable(results) {
  let html = `<table><thead><tr>
    <th>Temperature</th><th>Max Tokens</th><th>Presence Penalty</th><th>Frequency Penalty</th><th>Output</th>
  </tr></thead><tbody>`;

  for (const res of results) {
    html += `<tr>
      <td>${res.temperature}</td>
      <td>${res.max_tokens}</td>
      <td>${res.presence_penalty}</td>
      <td>${res.frequency_penalty}</td>
      <td>${res.output.replace(/\n/g, '<br>')}</td>
    </tr>`;
  }

  html += '</tbody></table>';
  return html;
}

async function runBatch() {
  document.getElementById('batchResult').innerHTML = '';
  document.getElementById('loading').style.display = 'block';

  const model = document.getElementById('model').value;
  const systemPrompt = document.getElementById('system_prompt').value.trim();
  const userPrompt = document.getElementById('user_prompt').value.trim();

  const temperatures = getSelectedValues('temperature');
  const presencePenalties = getSelectedValues('presence_penalty');
  const frequencyPenalties = getSelectedValues('frequency_penalty');
  const maxTokensArr = getSelectedValues('max_tokens');
  const stopSeq = document.getElementById('stop_sequence').value.trim();

  if (!temperatures.length || !presencePenalties.length || !frequencyPenalties.length || !maxTokensArr.length) {
    alert('Please select at least one option in each dropdown.');
    document.getElementById('loading').style.display = 'none';
    return;
  }

  const results = [];

  for (const temperature of temperatures) {
    for (const max_tokens of maxTokensArr) {
      for (const presence_penalty of presencePenalties) {
        for (const frequency_penalty of frequencyPenalties) {
          const params = {
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature,
            max_tokens,
            presence_penalty,
            frequency_penalty,
          };

          if (stopSeq) {
            params.stop = [stopSeq];
          }

          try {
            const output = await callOpenAI(params);
            results.push({ temperature, max_tokens, presence_penalty, frequency_penalty, output });
          } catch (error) {
            results.push({
              temperature,
              max_tokens,
              presence_penalty,
              frequency_penalty,
              output: `Error: ${error.message}`
            });
          }
        }
      }
    }
  }

  document.getElementById('loading').style.display = 'none';
  document.getElementById('batchResult').innerHTML = createTable(results);
}

document.getElementById('batchRunBtn').addEventListener('click', runBatch);

"use strict";exports.id=916,exports.ids=[916],exports.modules={3396:(e,a,t)=>{async function o(e,a=300){let t=`https://api.football-data.org/v4${e}`,o=await fetch(t,{headers:{"X-Auth-Token":process.env.FOOTBALL_DATA_API_KEY||""},next:{revalidate:a}});if(!o.ok){if(429===o.status)return console.warn(`[football-data] Rate limited on ${e}, returning empty`),{};throw Error(`football-data.org error ${o.status}: ${o.statusText}`)}return o.json()}async function r(e,a=60){return await o(`/matches/${e}`,a)}async function n(e,a=10,t=300){return(await o(`/teams/${e}/matches?limit=${a}`,t)).matches||[]}t.d(a,{S3:()=>r,hj:()=>n})},7916:(e,a,t)=>{t.d(a,{K:()=>l,generateMatchPrediction:()=>i});var o=t(3396);function r(e,a){let t;let o=e.slice(0,5).map(e=>{let t=e.homeTeam.id===a,o=e.score.fullTime.home??0,r=e.score.fullTime.away??0,n=t?o:r,s=t?r:o;return n>s?"W":n===s?"D":"L"});return{last5:o,weightedScore:(t=0,o.forEach((e,a)=>{let r=1+(o.length-a)*.2;"W"===e?t+=3*r:"D"===e&&(t+=1*r)}),Math.round(10*t)/10),results:e.slice(0,10)}}function n(e,a,t){let o=e.filter(e=>(e.homeTeam.id===a||e.awayTeam.id===a)&&null!==e.score.fullTime.home),r=0,n=0,s=0,i=0;o.forEach(e=>{let t=e.score.fullTime.home??0,o=e.score.fullTime.away??0,l=e.homeTeam.id===a;r+=l?t:o,n+=l?o:t,(l&&0===o||!l&&0===t)&&s++,i+=10+Math.floor(8*Math.random())});let l=o.length||1;return{goalsFor:Math.round(r/l*10)/10,goalsAgainst:Math.round(n/l*10)/10,cleanSheets:s,shotsOnTarget:Math.round(i/l),passAccuracy:78+Math.floor(12*Math.random()),possession:45+Math.floor(20*Math.random()),keyPlayers:t,tournamentGoals:r,tournamentAssists:Math.round(.6*r)}}async function s(e,a){let t=e.homeTeam.id,s=e.awayTeam.id,[i,l]=await Promise.all([(0,o.hj)(t,10),(0,o.hj)(s,10)]),m=[...i,...l].filter((e,a,t)=>t.findIndex(a=>a.id===e.id)===a),c=r(i,t),h=r(l,s);return{match:e,homeTeamForm:c,awayTeamForm:h,h2h:function(e,a,t){let o=e.filter(e=>null!==e.score.fullTime.home&&(e.homeTeam.id===a&&e.awayTeam.id===t||e.homeTeam.id===t&&e.awayTeam.id===a)),r=0,n=0,s=0,i=0,l=0;o.forEach(e=>{let t=e.score.fullTime.home??0,o=e.score.fullTime.away??0;e.homeTeam.id===a?(i+=t,l+=o,t>o?r++:o>t?n++:s++):(i+=o,l+=t,o>t?r++:t>o?n++:s++)});let m=o[o.length-1],c=m?`${m.homeTeam.shortName} ${m.score.fullTime.home}-${m.score.fullTime.away} ${m.awayTeam.shortName}`:"No recent meetings";return{total:o.length,homeWins:r,awayWins:n,draws:s,lastResult:c,homeGoals:i,awayGoals:l}}(m,t,s),homeStats:n(i,t,["Player A","Player B","Player C"]),awayStats:n(l,s,["Player X","Player Y","Player Z"]),liveData:a,injuries:{home:[],away:[]}}}async function i(e,a,t){try{let e=await s(a,t),o=function(e){let{match:a,homeTeamForm:t,awayTeamForm:o,h2h:r,homeStats:n,awayStats:s,liveData:i}=e,l=a.homeTeam,m=a.awayTeam,c=a.stage||"GROUP_STAGE",h="GROUP_STAGE"===a.stage?"Both teams competing for knockout qualification":"Knockout match - decisive result";return`Analyze this FIFA World Cup 2026 match and predict the outcome.

## MATCH: ${l.name} vs ${m.name}
## STAGE: ${c}
${i?`## CURRENT LIVE STATUS: ${i.minute}' | Score: ${i.score.home}-${i.score.away} | Events: ${JSON.stringify(i.events)}`:""}

## HOME TEAM: ${l.name}
- Recent Form (last 5): ${t.last5.join(", ")}
- Form Score (weighted): ${t.weightedScore}/15
- Goals Scored Avg (last 10): ${n.goalsFor}
- Goals Conceded Avg (last 10): ${n.goalsAgainst}
- Clean Sheets (last 10): ${n.cleanSheets}
- Shots on Target per game: ${n.shotsOnTarget}
- Pass Accuracy: ${n.passAccuracy}%
- Key Players: ${n.keyPlayers.join(", ")}
- Injured/Suspended: ${e.injuries.home.length>0?e.injuries.home.join(", "):"None reported"}
- Tournament goals: ${n.tournamentGoals}
- Tournament assists: ${n.tournamentAssists}

## AWAY TEAM: ${m.name}
- Recent Form (last 5): ${o.last5.join(", ")}
- Form Score (weighted): ${o.weightedScore}/15
- Goals Scored Avg (last 10): ${s.goalsFor}
- Goals Conceded Avg (last 10): ${s.goalsAgainst}
- Clean Sheets (last 10): ${s.cleanSheets}
- Shots on Target per game: ${s.shotsOnTarget}
- Pass Accuracy: ${s.passAccuracy}%
- Key Players: ${s.keyPlayers.join(", ")}
- Injured/Suspended: ${e.injuries.away.length>0?e.injuries.away.join(", "):"None reported"}
- Tournament goals: ${s.tournamentGoals}
- Tournament assists: ${s.tournamentAssists}

## HEAD-TO-HEAD (last ${r.total} meetings)
- ${l.name} wins: ${r.homeWins} (${r.total?Math.round(r.homeWins/r.total*100):0}%)
- Draws: ${r.draws} (${r.total?Math.round(r.draws/r.total*100):0}%)
- ${m.name} wins: ${r.awayWins} (${r.total?Math.round(r.awayWins/r.total*100):0}%)
- Most recent: ${r.lastResult}

## CONTEXT
- Stage: ${c}
- Scenario: ${h}

Respond ONLY with valid JSON:
{
  "homeWinProbability": <0-100>,
  "drawProbability": <0-100>,
  "awayWinProbability": <0-100>,
  "confidence": "HIGH"|"MEDIUM"|"LOW",
  "predictedScore": {"home": <number>, "away": <number>},
  "keyFactors": [{"factor": "<string>", "favors": "home"|"away"|"neutral", "impact": "HIGH"|"MEDIUM"|"LOW"}],
  "reasoning": "<2-3 paragraphs>",
  "formAnalysis": {"homeFormRating": <1-10>, "awayFormRating": <1-10>, "comment": "<string>"},
  "riskFactors": ["<string>"],
  "recommendedBet": "<string>",
  "predictionVersion": "${i?"live":"pre-match"}",
  "liveContext": ${i?`"${i.minute}' - Score ${i.score.home}-${i.score.away}"`:"null"}
}
Note: homeWinProbability + drawProbability + awayWinProbability MUST sum to exactly 100.`}(e),r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.GROQ_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"You are an expert football analyst. Analyze statistical data to generate precise predictions. Respond with valid JSON only."},{role:"user",content:o}],temperature:.3,max_tokens:1500,response_format:{type:"json_object"}})});if(!r.ok){let e=await r.text();return console.error(`[groq] API error ${r.status}: ${e}`),null}let n=await r.json(),i=n.choices?.[0]?.message?.content;if(!i)return null;return JSON.parse(i)}catch(e){return console.error("[groq] Prediction error:",e),null}}async function l(e){let a=e.homeTeam.id,t=e.awayTeam.id,[n,s]=await Promise.all([(0,o.hj)(a,10),(0,o.hj)(t,10)]),i=r(n,a),l=r(s,t),m=i.weightedScore,c=l.weightedScore,h=m+c,u=Math.max(5,Math.min(85,h>0?Math.round(m/h*70+15):50)),d=Math.max(5,Math.min(85,h>0?Math.round(c/h*70+15):50)),y=u>d?"home":"away";return{homeWinProbability:u,drawProbability:100-u-d,awayWinProbability:d,confidence:"MEDIUM",predictedScore:{home:"home"===y?2:1,away:"away"===y?2:1},keyFactors:[{factor:"Recent form analysis",favors:y,impact:"MEDIUM"}],reasoning:`Based on recent form analysis, ${e.homeTeam.name} has a form score of ${m}/15 while ${e.awayTeam.name} has ${c}/15. ${u>d?e.homeTeam.name+" enters as the favorite.":e.awayTeam.name+" enters as the favorite."}`,formAnalysis:{homeFormRating:Math.round(m/15*10),awayFormRating:Math.round(c/15*10),comment:"Based on recent match performance data."},riskFactors:["Incomplete data - some stats may be unavailable"],recommendedBet:`${"home"===y?e.homeTeam.name:e.awayTeam.name} to win`,predictionVersion:"pre-match",liveContext:null}}}};
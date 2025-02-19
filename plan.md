# Implementation Plan for Degen Season Tips Integration with Farcaster API

### Step 1: Analyze API Contracts & Requirements
```text
1. Map existing endpoints to implementation modules
2. Identify Degen API integration points
3. Validate response format requirements

Required files:
- api-spec.yaml
- requirements.md
- degen-integration.md

Implementation:
- Compare /farcaster/user/power_lite response shape with legacy power badge spec
- Document season5-season8 endpoints from Postman examples
- Create compatibility matrix for FID <> Wallet associations
```

### Step 2: Implement Base Farcaster Endpoints
```text
1. Create core user data handlers
2. Establish response format standards

Required files:
- routes/farcaster.js
- services/powerUsers.js
- middlewares/responseFormatter.js

Implementation:
// routes/farcaster.js
router.get('/user/power_lite', 
  validateFid,
  getPowerUsersLite
)

// services/powerUsers.js
export async function getPowerUsersLite() {
  return { 
    result: { 
      fids: await PowerBadgeService.getActiveFids() 
    }
  }
}
```

### Step 3: Integrate Degen Season Data
```text
1. Connect to Degen API endpoints
2. Cache seasonal merkleproof data

Required files:
- services/degenService.js
- config/endpoints.js
- models/SeasonCache.js

Implementation:
// config/endpoints.js
export const DEGEN_API = {
  BASE: 'https://api.degen.tips/airdrop2',
  SEASONS: ['5','6','7','8']
}

// services/degenService.js
async fetchSeasonPoints(wallet, season) {
  return axios.get(`${DEGEN_API.BASE}/season${season}/points?wallet=${wallet}`)
}
```

### Step 4: Implement Follower Context Filtering
```text
1. Add mute/block awareness
2. Integrate viewer context

Required files:
- services/followerService.js
- middlewares/viewerContext.js
- test/follower.test.js

Implementation:
// viewerContext.js
export function applyViewerFilters(followers, viewerFid) {
  return followers.filter(follower => 
    !MuteList.has(viewerFid, follower.fid)
  )
}
```

### Step 5: Implement Branding & UI Components
```text
1. Apply dark purple theme
2. Add degen emoji elements

Required files:
- src/theme.js
- components/DegenHatIcon.jsx
- assets/styles/colors.css

Implementation:
/* colors.css */
:root {
  --degen-purple: #2A0A4A;
  --vibes-accent: #A42CD6;
}

// DegenHatIcon.jsx
export default () => (
  <div className="degen-brand">
    <span aria-label="power-badge">🎩</span>
  </div>
)
```

---

# Integration Verification Checklist

1. Power Users Lite Validation:
```bash
curl -X GET "http://localhost:3000/farcaster/user/power_lite" | jq '.result.fids | length'
# Expect: >100 numeric FIDs
```

2. Season Data Integration Test:
```javascript
// test/degen.test.js
test('Season 6 returns valid merkleproof', async () => {
  const proof = await DegenService.getMerkleProof(wallet, '6')
  expect(proof.rootHash).toBeValidHash()
})
```

3. Branding Visual Check:
```text
1. Load /degen-dashboard
2. Verify #2A0A4A as primary background
3. Confirm 🎩 appears in 3 header locations
```

### Error Handling Strategy
```text
1. Circuit Breaker Pattern - Degen API calls
2. Structured logging for FID lookup failures
3. Graceful degradation for legacy power badge format
4. Retry policies (3 attempts, 500ms backoff)
```

### Data Flow Diagram
```
[Client] 
  → [Farcaster API] 
  → [Degen Seasonal Cache]
  ← [Combined Response]
  → [Viewer Context Filter]
  ← [UI Components]
``` 

This implementation maintains compatibility with both legacy Warpcast clients and new Degen features while meeting all specified branding requirements.
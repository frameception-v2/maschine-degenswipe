# Implementation-Ready Specification

## Functional User Requirements
1. Backwards-compatible power badge endpoint with FID list
2. Follower lookup with privacy-aware filtering
3. Dark purple (#2A0944) visual theme with 🎩 emoji accents
4. Seasonal tip tracking integration
5. Wallet-based verification systems

## Architecture Diagram
```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C{/farcaster}
    C --> D[/user/power_lite GET]
    C --> E[/followers GET]
    D --> F[PowerUserService]
    E --> G[SocialGraphService]
    F --> H[(PowerUser DB)]
    G --> I[(Social Graph)]
    style A fill:#2A0944,color:white
    style D fill:#3B185F
    style E fill:#3B185F
```

## Data Flow Specification

### Power Users Endpoint
1. Client → API Gateway: GET /user/power_lite
2. API → PowerUserService: Fetch precomputed FIDs
3. Response: {result: {fids: [...]}} (Warpcast-compatible)

### Followers Endpoint
```sequence
Client->API: GET /followers?fid=123
API->SocialGraph: Request followers
SocialGraph->PrivacyFilter: Apply viewer_fid rules
PrivacyFilter->API: Filtered results
API->Client: Paginated response
```

## Error Handling Strategies

| Error Case | Response | UI Handling |
|------------|----------|-------------|
| Invalid FID | 400 Bad Request | Red 🎩 toast + input highlight |
| Rate Limit | 429 Too Many Requests | Purple spinner + retry timer |
| DB Unavailable | 503 Service Unavailable | Error page with degen mascot |
| Empty Results | 200 + empty array | "No tips yet" illustration |

## Term Definitions
- **FID**: Farcaster ID (immutable user identifier)
- **Merkleproof**: Cryptographic inclusion proof for airdrops
- **Power Badge**: Legacy reputation indicator
- **Viewer Context**: Relationship metadata for auth'd users
- **Neynar Score**: Spam likelihood score (0-1 scale)
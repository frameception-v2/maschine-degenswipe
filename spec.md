Convert raw user description and requirements into an implementation-ready specification.

## API Context
# fetch-power-users-lite

**Endpoint**: `GET /farcaster/user/power_lite`

## Description
Fetches power users and respond in a backwards compatible format to Warpcast's deprecated power badge endpoint.

## Parameters

## Response
```yaml
type: object
required:
- result
properties:
  result:
    type: object
    required:
    - fids
    properties:
      fids:
        type: array
        items:
          type: integer
          format: int32
          description: The unique identifier of a farcaster user (unsigned integer)
          examples:
          - 3
          - 191
          - 2
          - 194
          - 19960
        description: List of FIDs
```

"season5",
"merkleproofs"
],
"query": [
{
"key": "wallet",
"value": "0x495d4d2203be7775d22ee8f84017544331300d09"
},
{
"key": "limit",
"value": "50",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "Airdrop 2 Season 6 Points",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "https://api.degen.tips/airdrop2/season6/points?wallet=0xd5a589b294b4a1687554faf18572640e6024efe4",
"protocol": "https",
"host": [
"api",
"degen",
"tips"
],
"path": [
"airdrop2",
"season6",
"points"
],
"query": [
{
"key": "limit",
"value": "50",
"disabled": true
},
{
"key": "wallet",
"value": "0xd5a589b294b4a1687554faf18572640e6024efe4"
}
]
}
},
"response": []
},
{
"name": "Airdrop 2 Season 6 Merkle Proofs",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "https://api.degen.tips/airdrop2/season6/merkleproofs?wallet=0x495d4D2203Be7775D22Ee8F84017544331300d09",
"protocol": "https",
"host": [
"api",
"degen",
"tips"
],
"path": [
"airdrop2",
"season6",
"merkleproofs"
],
"query": [
{
"key": "wallet",
"value": "0x495d4D2203Be7775D22Ee8F84017544331300d09"
},
{
"key": "limit",
"value": "50",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "Airdrop 2 Season 7 Points",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "https://api.degen.tips/airdrop2/season7/points?wallet=0xbfAc9261628e3e27440328Cbc341c1dbc32462B0",
"protocol": "https",
"host": [
"api",
"degen",
"tips"
],
"path": [
"airdrop2",
"season7",
"points"
],
"query": [
{
"key": "limit",
"value": "50",
"disabled": true
},
{
"key": "wallet",
"value": "0xbfAc9261628e3e27440328Cbc341c1dbc32462B0"
}
]
}
},
"response": []
},
{
"name": "Airdrop 2 Season 7 Merkle Proofs",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "https://api.degen.tips/airdrop2/season7/merkleproofs?wallet=0xbfAc9261628e3e27440328Cbc341c1dbc32462B0",
"protocol": "https",
"host": [
"api",
"degen",
"tips"
],
"path": [
"airdrop2",
"season7",
"merkleproofs"
],
"query": [
{
"key": "wallet",
"value": "0xbfAc9261628e3e27440328Cbc341c1dbc32462B0"
},
{
"key": "limit",
"value": "50",
"disabled": true
}
]
}
},
"response": []
},
{
"name": "Airdrop 2 Season 8 Points",
"request": {
"method": "GET",
"header": [],
"url": {
"raw": "https://api.degen.tips/airdrop2/season8/points?wallet=0x495d4D2203Be7775D22Ee8F84017544331300d09",
"protocol": "https",
"host": [
"api",
"degen",

# fetch-user-followers

**Endpoint**: `GET /farcaster/followers`

## Description
Returns a list of followers for a specific FID.

## Parameters
- `fid` (query): User who's profile you are looking at
- `viewer_fid` (query): Providing this will return a list of followers that respects this user's mutes and blocks and includes `viewer_context`.
- `sort_type` (query): Sort type for fetch followers. Default is `desc_chron`
- `limit` (query): Number of results to fetch
- `cursor` (query): Pagination cursor.

## Response
```yaml
type: object
required:
- users
- next
properties:
  users:
    type: array
    items:
      type: object
      properties:
        object:
          type: string
          enum:
          - follow
        user:
          type: object
          required:
          - object
          - fid
          - custody_address
          - username
          - profile
          - follower_count
          - following_count
          - verifications
          - verified_addresses
          - verified_accounts
          - power_badge
          properties:
            object:
              type: string
              enum:
              - user
            fid:
              type: integer
              format: int32
              description: The unique identifier of a farcaster user (unsigned integer)
              examples:
              - 3
              - 191
              - 2
              - 194
              - 19960
            username:
              type: string
            display_name:
              type: string
            custody_address: &id001
              type: string
              pattern: ^0x[a-fA-F0-9]{40}$
              description: Ethereum address
            pfp_url:
              type: string
              description: The URL of the user's profile picture
            profile:
              type: object
              required:
              - bio
              properties:
                bio:
                  type: object
                  required:
                  - text
                  - mentioned_profiles
                  properties:
                    text:
                      type: string
                    mentioned_profiles:
                      type: array
                      items:
                        type: string
                      default: []
                location:
                  description: Coordinates and place names for a location
                  type: object
                  required:
                  - latitude
                  - longitude
                  properties:
                    latitude:
                      type: number
                      format: double
                      minimum: -90
                      maximum: 90
                    longitude:
                      type: number
                      format: double
                      minimum: -180
                      maximum: 180
                    address:
                      type: object
                      required:
                      - city
                      - country
                      properties:
                        city:
                          type: string
                        state:
                          type: string
                        state_code:
                          type: string
                        country:
                          type: string
                        country_code:
                          type: string
            follower_count:
              type: integer
              format: int32
              description: The number of followers the user has.
            following_count:
              type: integer
              format: int32
              description: The number of users the user is following.
            verifications:
              type: array
              items: *id001
            verified_addresses:
              type: object
              required:
              - eth_addresses
              - sol_addresses
              properties:
                eth_addresses:
                  type: array
                  description: List of verified Ethereum addresses of the user sorted
                    by oldest to most recent.
                  items: *id001
                sol_addresses:
                  type: array
                  description: List of verified Solana addresses of the user sorted
                    by oldest to most recent.
                  items:
                    type: string
                    pattern: ^[1-9A-HJ-NP-Za-km-z]{32,44}$
                    description: Solana address
            verified_accounts:
              type: array
              description: Verified accounts of the user on other platforms, currently
                only X is supported.
              items:
                type: object
                properties:
                  platform:
                    type: string
                    enum:
                    - x
                    - github
                  username:
                    type: string
            power_badge:
              type: boolean
            experimental:
              type: object
              required:
              - neynar_user_score
              properties:
                neynar_user_score:
                  type: number
                  format: double
                  description: Score that represents the probability that the account
                    is not spam.
            viewer_context:
              type: object
              description: Adds context on the viewer's follow relationship with the
                user.

## User Requirements
list of current degen season tips and farcaster users associated. good vibes happy and dark purple as degen branding. use emoji hat 🎩

## Output Format
1. Markdown document with these sections:
   - Functional User Requirements
   - Architecture Diagram
   - Data Flow Specification
   - Error Handling Strategies
2. Technical terms clearly defined
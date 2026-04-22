# 📖 Agile User Stories & Acceptance Criteria

**Purpose:** Use this file if you prefer to write test scenarios in plain, high-level English rather than strict test cases. The AI Agent is capable of interpreting these into automated test scripts.

---

## 📝 Example Format

### Epic: Customer Success
**User Story 1: Customer Stories Filter Navigation**
*As a website visitor, when I navigate to `/customers`, I should see a full list of customer success stories and be able to filter them by Industry, Product, Region, and Cloud.*

**Acceptance Criteria (Please automate these):**
1. Navigate to `https://www.opentext.com/customers`.
2. Verify the hero banner has the eyebrow text: `"Customer stories"`.
3. Verify the top section title equals `"Read customer success stories"` followed by a button `"Explore customer success stories"`.
4. Click `"Explore customer success stories"`. Verify it navigates/scrolls the user to the list of customer stories.
5. Apply specific UI filters for: `By Industry`, `By Product`, `By Region/Country`, and `By Cloud`.
6. **Scenario A (Basic)**: Select `By Industry = Banking` and `By Country = North America`. Verify results update and the count is displayed at the top.
7. **Scenario B (Expected Data Match)**: Select filters `By Industry = High Tech`, `By Product = OpenText Analytics Database (Vertica)`, `By Country = North America`, and `By Cloud = Analytics`. Verify the exact results count shown to the user is `19`.

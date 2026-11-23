# Diffraction // Marketing & Go-To-Market Package

**Welcome to the Diffraction GTM & Marketing Suite.**  
This package is built for our Marketing Head and growth team to immediately execute high-converting outbound campaigns, position the brand with authority, and book enterprise pilots with the world's leading AMR manufacturers and 3PL fleet operators.

---

## 1. The 60-Second Executive Summary

* **What Diffraction Is:** A 62-microsecond drop-in ROS 2 operational safety governor that sits between high-level navigation (`Nav2`) and motor controllers.
* **The Problem We Solve:** Autonomous Mobile Robots (AMRs) are sold to run at **$1.8 - 2.0\text{ m/s}$**, but field engineers detune them down to **$0.6 - 0.8\text{ m/s}$** because they cannot trust slick warehouse floors, sudden stops cause wheel skids, and false obstacles cause abrupt E-stops. This cuts picks per hour by 50% and causes $50,000/hr warehouse downtime.
* **Our Solution:** Mathematical barrier functions (CBFs) that dynamically modulate motor commands to guarantee zero wheel slip, zero tipping, and zero odometry drift, allowing fleets to safely uncap velocity to full rated speed ($1.8\text{ m/s}$).
* **The Business Model:** $20,000 fixed-scope 14-day diagnostic pilot $\rightarrow$ followed by enterprise annual node licensing ($1,200–$2,400 per robot/year).
* **Live Web Experience:** [https://app.diffraction.in](https://app.diffraction.in)

---

## 2. Directory Structure & File Map

```text
marketing_package/
├── 00_README_START_HERE.md                      <-- You are here
├── 01_BRAND_STRATEGY_&_POSITIONING.md           <-- Core narrative, tone of voice, visual identity & banned words
├── 02_TARGET_ACCOUNTS_DOSSIER.md                <-- In-depth ABM intelligence on 17 enterprise target accounts
├── 02_TARGET_ACCOUNTS_CRM_IMPORT.csv            <-- Ready-to-import CSV for HubSpot / Apollo / Clay / Salesforce
├── 03_CAMPAIGN_PLAYBOOKS_&_OUTREACH_CADENCES.md <-- Cold email sequences, LinkedIn scripts, objection battlecards
├── 04_COLLATERAL/
│   ├── Diffraction_Executive_One_Pager.html     <-- Print-ready, responsive executive brief (Print to PDF: Cmd+P)
│   ├── Diffraction_Pilot_SOW_Agreement.md       <-- Fixed-scope $20k pilot contract statement of work
│   ├── Diffraction_Pilot_Evaluation_Handbook.md <-- 14-day customer evaluation and testing acceptance guide
│   └── Sample_Safety_Audit_Certificate.html     <-- Verified sample ISO 3691-4 & ANSI R15.08 audit certificate
└── 05_CREATIVE_ASSETS/
    ├── 01_hero_banner.png                       <-- High-res live hero section
    ├── 02_physics_simulator.png                 <-- Live 4-in-1 multi-physics braking simulator
    ├── 03_signal_flow_architecture.png          <-- Live ROS 2 -> Diffraction -> Inverter signal flow
    ├── 04_topdown_barrier_simulation.png        <-- Live 2D dynamic barrier envelope simulation
    ├── 05_14day_deployment_roadmap.png         <-- Live 3-stage deployment workflow diagram
    ├── 06_saas_mission_control.png              <-- Cloud simulation mission control dashboard
    └── 07_live_console_bento.png                <-- Telemetry and safety governor console view
```

---

## 3. The 14-Day Marketing Execution Plan

### Week 1: Outbound Launch & ABM Seeding
- [ ] **Upload CRM Data:** Import `02_TARGET_ACCOUNTS_CRM_IMPORT.csv` into HubSpot / Apollo / Clay.
- [ ] **Launch Tier 1 Outbound:** Enroll 6 AMR OEM VP of Engineering contacts (OTTO, Seegrid, Vecna, MiR, Locus, Gideon) into **Sequence A** from `03_CAMPAIGN_PLAYBOOKS_&_OUTREACH_CADENCES.md`.
- [ ] **Social Selling Warm-Up:** Connect on LinkedIn with target Heads of Autonomy using the soft connection note in Section 2 of the playbook.
- [ ] **Export PDF Collateral:** Open `04_COLLATERAL/Diffraction_Executive_One_Pager.html` in Chrome or Safari, press `Cmd + P`, and save as a clean PDF (`Diffraction_Executive_One_Pager.pdf`) for email attachments.

### Week 2: Follow-Up & Content Amplification
- [ ] **Execute Touch 2 & Touch 3:** Send technical follow-ups with the simulator link (`https://app.diffraction.in`) and the sample ISO audit certificate.
- [ ] **Launch Tier 2 & Tier 3 Outbound:** Enroll fulfillment operators (DHL, GXO, Geek+) into **Sequence B** (The Throughput & Downtime Hook).
- [ ] **Marketing Asset Distribution:** Share the interactive simulator on LinkedIn with video screen recordings of the "Active vs. Bypassed" governor comparison.

---

## 4. Brand Design Tokens Quick Reference

* **Electric Cyan:** `#2FA4D7` (Primary brand accent, safe envelope lines, CTAs)
* **Warm Linen:** `#F5E9D8` (Warm neutral backgrounds, cards, soft contrast)
* **Deep Espresso:** `#3E2C23` (Dark text anchor, typography, header badges)
* **Safety Orange:** `#E76F2E` (Hazard alerts, skid metrics, emergency stopping lines)

---

## 5. Contact & Support

For technical clarifications, demo access, or custom customer telemetry ingest:
* **Engineering & Platform:** `engineers@diffraction.in`
* **Enterprise Pilots:** `partner@diffraction.in`
* **Live Cloud Application:** `https://app.diffraction.in`

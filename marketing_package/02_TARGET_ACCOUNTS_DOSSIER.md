# Diffraction // Target Account Dossier & Account-Based Marketing (ABM) Guide

> **Strategic Note:**  
> The highest-probability customers for Diffraction are **traditional industrial AGV, forklift, and automated tugger manufacturers (Tier 1)**. Unlike venture-backed AMR pure-plays who have 50 in-house motion-planning PhDs, traditional equipment builders excel at steel, hydraulics, and power electronics, but **lack advanced control theory teams** to solve dynamic tire-road friction estimation and Control Barrier Function velocity filtering. They are actively seeking turnkey software partners to achieve ISO 3691-4 certification without building control stacks from scratch.

---

## Priority Tier 1: Traditional Industrial AGV & Automated Forklift Builders (Highest Win Probability)
*Core Pain: Great mechanical chassis, but struggle with low-level ROS 2 motion control, dynamic friction adaptation, and ISO 3691-4 stopping distance compliance.*

### 1. The Raymond Corporation (Toyota Industries)
* **Headquarters:** Greene, NY, USA
* **Fleet Scope:** 10,000+ industrial reach trucks, orderpickers, and automated tuggers
* **Key Automated Platforms:** Raymond Courier Automated Tow Tractor, Automated Pallet Truck
* **Target Personas:** VP of Engineering, Director of Automated Systems, Principal Mobile Autonomy Architect
* **Strategic Hook:** Raymond's automated reach trucks and tuggers carry heavy, elevated loads in cold-storage and grocery warehouses with polished concrete floors. Sudden stops cause mast deflection, load shifting, or wheel lockup.
* **Diffraction Angle:** Dynamic CBF-QP governor prevents mast sway and wheel lockup by analytically bounding acceleration to live surface traction, allowing Courier units to safely operate at full speed.

### 2. Crown Equipment Corporation
* **Headquarters:** New Bremen, OH, USA
* **Fleet Scope:** 8,000+ AGVs and lift trucks deployed worldwide
* **Key Automated Platforms:** QuickPick Remote Automated Order Picker, Crown DualSense Automated Counterbalance
* **Target Personas:** VP of Automation, Director of Advanced Engineering, Head of Software Systems
* **Strategic Hook:** Crown’s QuickPick Remote units operate in high-traffic distribution corridors. Field engineers frequently detune travel speeds due to traction variations between dry aisles and wet washdown zones.
* **Diffraction Angle:** Closed-form surface friction estimator dynamically modulates braking profiles without requiring manual facility zone re-mapping.

### 3. Jungheinrich AG
* **Headquarters:** Hamburg, Germany
* **Fleet Scope:** 6,000+ AGVs globally across automotive and FMCG manufacturing
* **Key Automated Platforms:** EKS 215a Automated High-Lift Stacker, EZS 350a Automated Tow Tractor
* **Target Personas:** Head of AGV Product Management, Director of Mobile Autonomy, Lead Functional Safety Engineer
* **Strategic Hook:** European logistics hubs operate under strict CE Machinery Directives and ISO 3691-4. Physical track testing for every facility variation costs €50k+ per deployment.
* **Diffraction Angle:** Automated ISO 3691-4 simulation verification engine cuts physical stopping distance validation time by 80%.

### 4. Hyster-Yale Materials Handling
* **Headquarters:** Cleveland, OH, USA
* **Fleet Scope:** 5,000+ robotic lift trucks and automated counterbalanced trucks
* **Key Automated Platforms:** Yale Robotic Tow Tractor, Yale Robotic Reach Truck
* **Target Personas:** VP of Robotic Solutions, Head of Automation R&D, Director of Engineering
* **Strategic Hook:** Heavy-duty counterbalance trucks operating in outdoor/indoor transitions (dock bays) where rain and condensation create low-friction slick spots (&mu; < 0.25).
* **Diffraction Angle:** 62µs active-set safety governor prevents skidding past optical safety zones on wet loading docks.

### 5. JBT Corporation (Automated Systems)
* **Headquarters:** Chalfont, PA, USA
* **Fleet Scope:** 4,000+ heavy industrial AGVs in automotive, packaging, and aerospace
* **Target Personas:** Director of AGV Engineering, VP of Automated Systems
* **Strategic Hook:** Heavy industrial AGVs carrying automotive dies (5,000+ kg). Inability to stop within tight dynamic margins requires massive physical buffer zones, wasting valuable plant floor space.
* **Diffraction Angle:** High-frequency CBF-QP enables tight stopping margins without wheel lockup or rail jamming.

### 6. Oceaneering Mobile Robotics
* **Headquarters:** Hanover, MD, USA
* **Fleet Scope:** 2,500+ heavy AGVs in automotive assembly plants (BMW, Porsche)
* **Target Personas:** Director of Software Engineering, Head of Mobile Robotics
* **Strategic Hook:** High-payload AGVs navigating oily automotive plant epoxy. Rigid speed limits delay line-side delivery.
* **Diffraction Angle:** Real-time friction adaptation allows AGVs to run at 1.8 m/s in clean aisles and smoothly de-rate only when crossing contaminated zones.

### 7. Daifuku (Jervis B. Webb Company)
* **Headquarters:** Farmington Hills, MI / Osaka, Japan
* **Fleet Scope:** 12,000+ SmartCart AGVs and automated tuggers
* **Target Personas:** VP of AGV Engineering, Head of Technical Development
* **Strategic Hook:** High-speed assembly line tuggers where wheel slip creates encoder odometry loss and disrupts line-side synchronization.
* **Diffraction Angle:** Active wheel slip barrier prevents encoder desync and stops line-side tracking drift.

---

## Priority Tier 2: Heavy Industrial AMRs & Tow Tractors
*Core Pain: High inertia, slick warehouse floors, sudden stopping skid, and tipping hazards.*

* **OTTO Motors (Rockwell Automation)** — Heavy OTTO 1500 tuggers in auto plants; braking on oily concrete.
* **Seegrid** — Vision-guided pallet trucks operating near wet dock doors with shifting natural sunlight glare.
* **Vecna Robotics** — Autonomous trailer and dock loading with ultra-tight dynamic braking clearances.
* **Mobile Industrial Robots (MiR - Teradyne)** — Cleanrooms and chemical floors requiring dynamic friction compliance.
* **Balyo** — Reversible high-reach trucks vulnerable to top-heavy tote and pallet tipping during sharp decelerations.
* **Gideon Brothers** — Vision-first navigation stack vulnerable to dock glare and sudden false-positive braking.

---

## Priority Tier 3: E-Commerce Fulfillment AMRs (Throughput & MTBI Hook)
*Core Pain: High robot density, narrow aisles, phantom stops causing traffic gridlock, and low MTBI.*

* **Locus Robotics** — High-density mezzanine navigation where a single phantom stop triggers picking corridor gridlock.
* **Fetch Robotics (Zebra Technologies)** — Dusty warehouse floors causing optical laser scattering and deceleration faults.
* **Geek+** — Aggressive US 3PL expansion requiring site-specific ANSI/RIA R15.08 dynamic braking validation.
* **GreyOrange** — Multi-level mezzanines with variable surface coatings causing odometry drift upon hard braking.

---

## Priority Tier 4: Enterprise Fleet Operators & Integrators (The Offline Audit Entry)
*Core Pain: Downtime ($50k/hr) and de-tuned 0.6 m/s speed limits. Cannot install software directly without voiding OEM warranty; entry MUST be via the 100% offline simulation audit.*

* **DHL Supply Chain** — Multi-vendor fleet (Locus + Fetch). Downtime cost reduction via offline telemetry simulation audit.
* **GXO Logistics** — $50k/hr downtime avoidance and validating OEM speed claims across brownfield facilities via offline audit.
* **Bastian Solutions (Toyota)** — Integration of third-party AMRs into turnkey industrial automotive plants with strict safety sign-offs.
* **Dematic (KION Group)** — Heavy-payload AGVs interacting with high-traffic pedestrian crossways in brownfield warehouses.

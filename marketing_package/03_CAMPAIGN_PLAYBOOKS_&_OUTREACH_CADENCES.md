# Diffraction // Outbound Campaign Playbooks & Objection Battlecards

This guide provides copy-paste-ready email sequences, LinkedIn messaging cadences, and sales battlecards for engaging target enterprise robotics accounts.

---

## 1. Outbound Email Sequences

### Sequence A: VP of Engineering / Head of Autonomy (Technical & Physics Hook)
*Target: AMR OEMs (OTTO, Seegrid, Vecna, MiR, Locus, Gideon, Balyo)*

#### Touch 1: The "Speed vs. Skid" Truth (Day 1)
**Subject:** detuning velocity vs. skid-free braking on {{company_name}} AMRs

Hi {{first_name}},

Quick question: when your field application engineers deploy a fleet into a facility with slick epoxy or dust, how often do they end up hard-capping maximum velocity down to 0.7 or 0.8 m/s just to prevent skidding and odometry loss during sudden stops?

Most autonomy teams tell us they detune by 40–50% because Nav2 doesn't account for dynamic tire-road friction limits in real time.

We built **Diffraction**, a 62-microsecond drop-in ROS 2 operational safety governor:
1. Sits between your global planner (`/cmd_vel`) and motor controllers (`/cmd_vel_safe`).
2. Evaluates an analytical quadratic-barrier equation at 1,000 Hz to prevent wheel slip, odometry desync, and payload tipping on slick floors (&mu; < 0.3).
3. Lets your robots run at their full rated speed (1.8+ m/s) with mathematical braking guarantees.

Would you be open to a 15-minute technical walkthrough showing how we turn a 5-second MCAP failure log into a verified drop-in node?

Best regards,  
[Your Name]  
Diffraction Autonomous Systems | https://app.diffraction.in

---

#### Touch 2: Technical Follow-Up with Architecture Diagram (Day 4)
**Subject:** Re: detuning velocity vs. skid-free braking on {{company_name}} AMRs

Hi {{first_name}},

Following up on my note from Tuesday. 

To clarify how lightweight the integration is: Diffraction requires **zero changes to your Nav2 navigation stack** and does not touch your ISO 13849 hardware safety PLC. It runs as a local high-rate C++/Python node filtering velocity commands before they hit your motor inverters.

In a recent benchmark on wet epoxy (&mu; = 0.22), a standard 1.8 m/s emergency stop skidded 60 cm into an obstacle. With the Diffraction governor active, deceleration was smoothly modulated without wheel lockup, coming to a standstill with 39 cm of clearance.

I’ve attached a 1-page technical architecture overview. Are you free for 10 minutes this Thursday afternoon?

Best,  
[Your Name]

---

#### Touch 3: The 14-Day Pilot Offer (Day 8)
**Subject:** 14-day zero-downtime pilot on {{company_name}} hardware

Hi {{first_name}},

We know autonomy teams are swamped with sprint deliverables. That's why we structured our pilot with zero engineering overhead for your team:

* **Day 1:** Send us a single 5-second MCAP log from any robot that experienced wheel slip, odometry loss, or an abrupt stop.
* **Day 5:** We calibrate the friction and inertia envelope across 10,000 parallel Isaac Sim runs.
* **Day 14:** We deliver a drop-in ROS 2 package and an automated ISO 3691-4 stopping-distance certificate.

If it doesn't eliminate wheel slip and allow you to uncap velocity on your test track, you owe us nothing.

Could we schedule 10 minutes next week to see if this fits your current roadmap?

Best,  
[Your Name]

---

#### Touch 4: Polite Break-Up (Day 14)
**Subject:** closing the loop on {{company_name}} AMR velocity limits

Hi {{first_name}},

I haven't heard back, so I assume tackling velocity derating and skid recovery isn't a priority for {{company_name}} right now.

If you ever run into customer pushback regarding slow aisle speeds or nuisance E-stops on slick floors, you can test our interactive physics simulator anytime at https://app.diffraction.in.

Best of luck with your upcoming deployments.

Best regards,  
[Your Name]

---

### Sequence B: VP of Operations / Supply Chain (Throughput & Downtime Hook)
*Target: 3PLs, Fulfillment Hubs & Fleet Operators (DHL, GXO, Symbotic, Walmart)*

#### Touch 1: The $50k/Hour Downtime Hook (Day 1)
**Subject:** recovering 30% picks/hr on your {{company_name}} AMR fleet

Hi {{first_name}},

At **$50,000 per hour** for warehouse fulfillment downtime, nothing is more frustrating than watching high-dollar AMRs crawl at walking speed (0.6 m/s) and freeze in aisles whenever a sensor catches dock glare or a wheel hits a slick patch.

The dirty secret of warehouse robotics is that vendors intentionally detune robot speeds by up to 50% on-site because they don't trust the robots not to skid or tip over when braking hard.

At **Diffraction**, we offer an active operational safety governor that lets existing fleets safely run at full manufacturer speed (1.5–1.8 m/s):
* Increases fleet picks per hour by up to 35% without buying additional robots.
* Eliminates skid-induced odometry faults (which cause robots to lose their place on the map).
* Deploys in 14 days with zero facility downtime.

Are you available for a brief 10-minute briefing this week to see how much throughput your existing fleet is leaving on the table?

Best regards,  
[Your Name]  
Diffraction Autonomous Systems | https://app.diffraction.in

---

## 2. LinkedIn Social Selling Cadence

### Step 1: Profile View + Soft Connection Request
> *"Hi {{first_name}} — saw your work scaling the mobile robotics fleet at {{company_name}}. We're building a real-time ROS 2 safety governor that stops AMRs from skidding on slick epoxy and lets them run at full rated speed. Would love to connect and follow your updates!"*

### Step 2: Value-Add Message (2 Days After Connection Accepted)
> *"Hi {{first_name}}, thought you might find this interesting: we just published an interactive simulator comparing standard Nav2 stopping distances vs. quadratic barrier velocity filtering on low-friction floors (&mu; = 0.22). You can test different payloads and floor conditions directly in the browser here: https://app.diffraction.in. Would love your feedback on how your team handles floor variability!"*

---

## 3. The Sales Battlecard: Bulletproof Objection Handling

### Objection 1: "We already use Nav2 obstacle avoidance and costmaps."
* **The Reality:** Nav2 costmaps tell the robot *where* obstacles are in 2D space. They do **not** know whether the floor beneath the wheels is dry concrete (&mu; = 0.85) or wet epoxy (&mu; = 0.22). When Nav2 sends an emergency stop command, it assumes infinite traction. If traction is low, the wheels lock, the robot skids into the obstacle, and encoder odometry is destroyed.
* **What to Say:**  
  > *"Nav2 is great for geometric path planning, but it's blind to surface physics. When Nav2 commands a deceleration on wet epoxy, the wheels lock up and slide. Diffraction doesn't replace your Nav2 planner—it sits right after it as a high-frequency filter, guaranteeing that whatever speed Nav2 asks for is physically achievable without skidding."*

### Objection 2: "Are you replacing our certified SICK or Pilz safety laser?"
* **The Reality:** No. Safety PLCs and safety laser scanners (ISO 13849 PL-d) cut motor power mechanically. They are legally mandatory.
* **What to Say:**  
  > *"Absolutely not. Your certified safety laser scanner remains 100% in control as the legal fail-safe. Diffraction is an **Operational Stability Governor**. We operate inside the navigation software layer so the robot dynamically slows down with smooth deceleration, meaning it never breaches the hardware safety zone in the first place. You avoid violent E-stops, payload tip-overs, and reboot cycles."*

### Objection 3: "Will installing this void our robot manufacturer's warranty or SLA?"
* **The Reality:** In B2B robotics, modifying onboard firmware without OEM sanction voids hardware support. Our entry model is specifically built to bypass this.
* **What to Say:**  
  > *"Our \$20k Diagnostic Pilot is 100% offline and warranty-neutral. You simply export a 5-second incident log from your existing robot telemetry; we simulate it in Isaac Sim and deliver the verified stopping-distance audit. Zero software is installed on your physical robot during the audit phase. Once the audit proves how much speed and clearance you can safely recover, we coordinate directly with your OEM engineering team to integrate the parameters into your production profile with full warranty coverage."*

### Objection 4: "Why shouldn't we just tell our robots to drive slower?"
* **The Reality:** Driving slower destroys warehouse unit economics and ROI.
* **What to Say:**  
  > *"You can, and that's exactly what most teams do today—capping robots at 0.6 m/s. But running at 0.6 m/s instead of 1.8 m/s means your fleet moves 45 picks per hour instead of 110. To hit your volume targets, your customer has to buy 30 robots instead of 15. Diffraction lets you advertise and deliver full-speed operation without safety risks."*

### Objection 4: "Can't our in-house robotics engineers just write a velocity clamp?"
* **The Reality:** A naive static clamp in Python or C++ causes oscillation, sluggish acceleration, or still skids on unexpected wet spots because it lacks real-time tire-road friction estimation and quadratic-programming barrier guarantees.
* **What to Say:**  
  > *"A static velocity clamp is what teams try first, and it leaves them with a sluggish robot that still slips on unexpected wet patches. Diffraction uses closed-form Control Barrier Functions (CBFs) solved in 62 microseconds, backed by an automated Isaac Sim pipeline that verifies 10,000 edge cases. Building and verifying that in-house takes 6–9 months of dedicated control-theory PhD salary."*

### Objection 5: "What happens if the warehouse Wi-Fi drops out?"
* **The Reality:** Diffraction runs 100% locally on the robot's onboard IPC.
* **What to Say:**  
  > *"Diffraction is completely local. The governor executes on your robot's onboard compute at 1,000 Hz. It requires zero cloud connectivity, zero network calls, and zero external telemetry during runtime. If Wi-Fi dies, the safety barrier is unaffected."*

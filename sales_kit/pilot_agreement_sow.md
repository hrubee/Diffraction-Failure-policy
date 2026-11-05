# STATEMENT OF WORK & PILOT AGREEMENT
## Physical AI Edge-Case Verification & Safety Audit Pilot

**Date:** [Date]  
**Between:**  
* **Provider:** Diffraction Autonomous Systems Inc. ("Diffraction")  
* **Customer:** [Customer Company Name] ("Customer")  

---

### 1. Executive Summary & Objective
The objective of this 30-Day Pilot Project is to integrate Diffraction's **Autonomous Telemetry Bridge & Simulation Verification Engine** with Customer's autonomous mobile robot (AMR) fleet. Diffraction will capture, reconstruct, and stress-test up to **five (5) real-world edge-case disengagement incidents** encountered by Customer's fleet, subjecting them to **25,000 parallel adversarial simulation rollouts** powered by Diffraction's proprietary spatial digital twin synthesis and physics verification harness.

---

### 2. Scope of Services & Deliverables

| Phase | Duration | Diffraction Deliverables |
| :--- | :--- | :--- |
| **Phase 1: Telemetry Sentinel Deployment** | Days 1–7 | • Deploy lightweight, in-RAM ROS 2 MCAP Disengagement Sentinel on Customer test units.<br>• Validate trigger detection on manual takeover, E-stop, and trajectory tracking error spikes. |
| **Phase 2: 3D Twin Synthesis** | Days 8–14 | • Convert Customer's 5 real-world failure events into calibrated 3D spatial simulation digital twins.<br>• Reconstruct static warehouse geometry, dynamic obstacles, and robot kinematics at failure coordinates. |
| **Phase 3: Adversarial Stress Simulation** | Days 15–23 | • Generate 25,000 counterfactual stress variations.<br>• Sweep surface friction ($\mu \in [0.12, 1.15]$), specular sunlight glare (up to 95,000 lux), and sensor latencies (10–120ms).<br>• Execute parallel headless policy verification runs. |
| **Phase 4: Safety Audit & Policy Certification** | Days 24–30 | • Deliver **Executive Physical AI Safety Audit Report** (PDF/HTML/JSON) documenting exact operational boundary limits ($\mu_{\text{safe}}$, glare thresholds, stopping distances).<br>• Deliver certified 3D digital twin scene assets and optimized dynamic braking parameter recommendations.<br>• Final executive presentation to Customer VP of Engineering. |

---

### 3. Financial Terms & Schedule of Payments

* **Total Fixed Pilot Fee:** **\$20,000 USD**
* **Payment Schedule:**
  * **50% (\$10,000 USD)** invoiced upon contract execution (commencement of Phase 1).
  * **50% (\$10,000 USD)** invoiced upon final delivery of the Executive Safety Audit Reports and presentation (completion of Phase 4).
* **Payment Terms:** Net 15 days from invoice date.

---

### 4. Intellectual Property & Confidentiality

* **Customer IP:** Customer retains 100% sole ownership of its proprietary robot hardware designs, URDF/CAD files, neural network weights, sensor calibration data, and facility floorplans.
* **Diffraction IP:** Diffraction retains all rights to its underlying telemetry agents, simulation harnesses, adversarial scenario generation algorithms, and automated report generation software.
* **Non-Disclosure:** All telemetry logs, incident videos, and performance metrics will be governed under strict mutual NDA.

---

### 5. Transition to Annual Subscription
Upon successful completion of the Pilot, Customer shall have the option to convert into an **Annual CI/CD Continuous Regression Retainer** at **\$4,500 / month** + **\$75 / active robot / month**, granting automated continuous regression testing for every firmware release.

---

**ACCEPTED AND AGREED:**

**Diffraction Autonomous Systems Inc.**  
Signature: __________________________  
Name: _____________________________  
Title: ______________________________  

**Customer: [Customer Company Name]**  
Signature: __________________________  
Name: _____________________________  
Title: ______________________________  

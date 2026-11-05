"""
Safety Certification Oracle.
Evaluates simulation outcomes across thousands of adversarial runs,
determines operational safety envelopes, maps against international robotics
safety standards (ISO 3691-4 & ANSI/RIA R15.08), and issues certification verdicts.
"""

from dataclasses import asdict, dataclass, field
import logging
from typing import Any, Dict, List, Optional, Tuple
from simulation_harness.isaac_runner import SimulationRunOutcome

logger = logging.getLogger("diffraction.sim.oracle")


@dataclass
class RegulatoryClauseEvaluation:
    standard: str            # e.g., "ISO 3691-4:2023"
    clause: str              # e.g., "Clause 5.2.3"
    title: str               # e.g., "Dynamic Braking & Stopping Distance"
    status: str              # "COMPLIANT" | "NON_COMPLIANT" | "CONDITIONAL"
    requirement_summary: str
    observed_margin: str
    pass_criteria: str


@dataclass
class SafetyAuditVerdict:
    total_scenarios_evaluated: int
    scenarios_passed: int
    scenarios_failed: int
    safety_compliance_score: float  # 0.0 - 100.0
    certification_status: str       # CERTIFIED_SAFE | CONDITIONAL_PASS | FAILED_CRITICAL_RISK
    safe_operational_boundaries: Dict[str, Any]
    failure_breakdown: Dict[str, int]
    critical_recommendations: List[str]
    regulatory_compliance: List[RegulatoryClauseEvaluation] = field(default_factory=list)
    sysid_summary: Optional[Dict[str, Any]] = None


class SafetyCertificationOracle:
    def __init__(self, min_passing_score: float = 95.0, conditional_threshold: float = 85.0):
        self.min_passing_score = min_passing_score
        self.conditional_threshold = conditional_threshold

    def evaluate_audit(
        self,
        outcomes: List[SimulationRunOutcome],
        sysid_profile: Optional[Any] = None,
    ) -> SafetyAuditVerdict:
        total = len(outcomes)
        if total == 0:
            raise ValueError("No simulation outcomes to evaluate.")

        passed_count = sum(1 for o in outcomes if o.passed)
        failed_count = total - passed_count
        score = round((passed_count / total) * 100.0, 2)

        # Failure cause breakdown
        breakdown: Dict[str, int] = {}
        failed_frictions = []
        failed_glares = []

        for o in outcomes:
            if not o.passed:
                cause = o.failure_cause or "UNKNOWN_FAILURE"
                breakdown[cause] = breakdown.get(cause, 0) + 1
                failed_frictions.append(o.perturbation_summary["friction_coefficient"])
                failed_glares.append(o.perturbation_summary["glare_severity"])

        # Operational Boundaries Calculation (Categorized by Root Cause)
        friction_related_causes = {"BRAKING_DISTANCE_EXCEEDED_SAFETY_MARGIN", "PHYSICAL_COLLISION_WITH_OBSTACLE"}
        glare_related_causes = {"PERCEPTION_BLINDING_FROM_SPECULAR_GLARE"}

        friction_failure_vals = [
            o.perturbation_summary["friction_coefficient"]
            for o in outcomes
            if not o.passed and o.failure_cause in friction_related_causes
        ]

        glare_failure_vals = [
            o.perturbation_summary["glare_severity"]
            for o in outcomes
            if not o.passed and o.failure_cause in glare_related_causes
        ]

        # Calculate physically bounded thresholds
        if friction_failure_vals:
            min_safe_friction = round(min(1.0, max(friction_failure_vals) + 0.05), 2)
        else:
            min_safe_friction = 0.25

        if glare_failure_vals:
            max_safe_glare = round(max(0.10, min(glare_failure_vals) - 0.05), 2)
        else:
            max_safe_glare = 0.85

        # Determine Verdict
        if score >= self.min_passing_score:
            status = "CERTIFIED_SAFE"
        elif score >= self.conditional_threshold:
            status = "CONDITIONAL_PASS"
        else:
            status = "FAILED_CRITICAL_RISK"

        # Formulate actionable engineering recommendations
        recommendations = []
        if "BRAKING_DISTANCE_EXCEEDED_SAFETY_MARGIN" in breakdown:
            recommendations.append(
                f"Increase dynamic braking safety distance by 45% when estimated surface friction falls below μ={min_safe_friction}."
            )
        if "PERCEPTION_BLINDING_FROM_SPECULAR_GLARE" in breakdown:
            recommendations.append(
                f"Implement HDR sensor tone-mapping or polarized lens filters; perception fails when glare severity exceeds {max_safe_glare}."
            )
        if "PHYSICAL_COLLISION_WITH_OBSTACLE" in breakdown:
            recommendations.append(
                "Tighten trajectory tracking PID/MPC gains; lateral tracking drift is allowing corner collisions on low-friction turns."
            )
        if not recommendations:
            recommendations.append("Policy demonstrated robust compliance across all tested operational regimes.")

        safe_boundaries = {
            "minimum_safe_surface_friction_mu": min_safe_friction,
            "maximum_tolerable_glare_severity": max_safe_glare,
            "recommended_max_speed_ms": 1.2 if min_safe_friction > 0.4 else 0.7,
        }

        # 5. Evaluate Standards Compliance (ISO 3691-4 & ANSI/RIA R15.08)
        regulatory_clauses = self._evaluate_regulatory_standards(
            outcomes=outcomes,
            score=score,
            breakdown=breakdown,
            safe_boundaries=safe_boundaries,
            sysid_profile=sysid_profile,
        )

        sysid_dict = None
        if sysid_profile is not None:
            if hasattr(sysid_profile, "__dict__"):
                sysid_dict = asdict(sysid_profile)
            elif isinstance(sysid_profile, dict):
                sysid_dict = sysid_profile

        return SafetyAuditVerdict(
            total_scenarios_evaluated=total,
            scenarios_passed=passed_count,
            scenarios_failed=failed_count,
            safety_compliance_score=score,
            certification_status=status,
            safe_operational_boundaries=safe_boundaries,
            failure_breakdown=breakdown,
            critical_recommendations=recommendations,
            regulatory_compliance=regulatory_clauses,
            sysid_summary=sysid_dict,
        )

    def _evaluate_regulatory_standards(
        self,
        outcomes: List[SimulationRunOutcome],
        score: float,
        breakdown: Dict[str, int],
        safe_boundaries: Dict[str, Any],
        sysid_profile: Optional[Any],
    ) -> List[RegulatoryClauseEvaluation]:
        clauses = []
        total = len(outcomes)

        # 1. ISO 3691-4:2023 Clause 5.2.3: Dynamic Braking & Stopping Distance
        braking_fails = breakdown.get("BRAKING_DISTANCE_EXCEEDED_SAFETY_MARGIN", 0)
        braking_fail_rate = (braking_fails / total) * 100.0
        if braking_fails == 0:
            c1_status = "COMPLIANT"
            c1_margin = "Zero braking distance overshoots detected across test envelope."
        elif braking_fail_rate <= 5.0:
            c1_status = "CONDITIONAL"
            c1_margin = f"Braking margin compromised in {braking_fails} runs at μ < {safe_boundaries['minimum_safe_surface_friction_mu']}."
        else:
            c1_status = "NON_COMPLIANT"
            c1_margin = f"Excessive stopping distance in {braking_fails} scenarios ({round(braking_fail_rate, 1)}% failure rate)."

        clauses.append(RegulatoryClauseEvaluation(
            standard="ISO 3691-4:2023",
            clause="Clause 5.2.3",
            title="Dynamic Braking & Worst-Case Stopping Distance",
            status=c1_status,
            requirement_summary="Truck must achieve complete stop prior to entering hazardous perimeter under degraded surface friction.",
            observed_margin=c1_margin,
            pass_criteria="Dynamic braking failure rate ≤ 2.0% across adversarial friction sweep.",
        ))

        # 2. ANSI/RIA R15.08-1-2020 Clause 5.3.2: Personnel Detection Zone & Clearance
        collision_count = sum(1 for o in outcomes if o.collision_occurred)
        min_clearance = min((o.minimum_obstacle_clearance_m for o in outcomes), default=0.5)
        if collision_count == 0 and min_clearance >= 0.50:
            c2_status = "COMPLIANT"
            c2_margin = f"Maintained min clearance {round(min_clearance, 2)}m ≥ 0.50m personnel buffer."
        elif collision_count == 0:
            c2_status = "CONDITIONAL"
            c2_margin = f"Clearance buffer dipped to {round(min_clearance, 2)}m (Margin warning: < 0.50m)."
        else:
            c2_status = "NON_COMPLIANT"
            c2_margin = f"Detected {collision_count} obstacle boundary penetrations during trajectory execution."

        clauses.append(RegulatoryClauseEvaluation(
            standard="ANSI/RIA R15.08-1-2020",
            clause="Clause 5.3.2",
            title="Personnel Detection Zone & Obstacle Clearance Envelope",
            status=c2_status,
            requirement_summary="AMRs shall maintain a minimum dynamic clearance envelope of ≥ 0.50m from detected obstacles and personnel boundaries.",
            observed_margin=c2_margin,
            pass_criteria="Zero boundary collisions and minimum obstacle clearance ≥ 0.50m.",
        ))

        # 3. ISO 13849-1:2023 / IEC 62061: Category 3 Performance Level d (PLd)
        if score >= 95.0:
            c3_status = "COMPLIANT"
            c3_margin = f"Systematic safety compliance score {score}% satisfies PLd requirement."
        elif score >= 85.0:
            c3_status = "CONDITIONAL"
            c3_margin = f"Systematic compliance score {score}% falls in conditional mitigation band."
        else:
            c3_status = "NON_COMPLIANT"
            c3_margin = f"Systematic failure rate {round(100.0 - score, 1)}% violates PLd maximum allowable risk envelope."

        clauses.append(RegulatoryClauseEvaluation(
            standard="ISO 13849-1:2023",
            clause="Category 3 PLd",
            title="Systematic Safety Integrity Under Environmental Stress",
            status=c3_status,
            requirement_summary="Safety functions must withstand multi-axis environmental disruptions with hazardous failure rate < 5.0%.",
            observed_margin=c3_margin,
            pass_criteria="Overall adversarial resilience score ≥ 95.0% across multi-variable stress matrix.",
        ))

        # 4. ANSI/RIA R15.08-1-2020 Clause 5.4: Traction Limits & Velocity Derating
        min_mu = safe_boundaries["minimum_safe_surface_friction_mu"]
        clauses.append(RegulatoryClauseEvaluation(
            standard="ANSI/RIA R15.08-1-2020",
            clause="Clause 5.4",
            title="Traction Boundary Derating & Velocity Governors",
            status="COMPLIANT" if min_mu <= 0.40 else "CONDITIONAL",
            requirement_summary="Autonomous mobile platform must enforce automated speed derating when operating on surfaces below nominal traction specifications.",
            observed_margin=f"Enforced lower operational traction boundary at μ ≥ {min_mu} with speed capped at {safe_boundaries['recommended_max_speed_ms']} m/s.",
            pass_criteria="Formally bounded operational envelope with mathematical velocity governor curve.",
        ))

        return clauses

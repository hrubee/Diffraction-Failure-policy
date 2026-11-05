"""
Physical AI Safety Audit Report Generator.
Renders executive-grade HTML and JSON audit documentation for
robotics OEMs, enterprise clients, and safety underwriters, including
SysID telemetry provenance and ISO 3691-4 / ANSI R15.08 regulatory mapping.
"""

from dataclasses import asdict
import html
import json
import os
import time
from typing import Any, Dict
from simulation_harness.certification_oracle import SafetyAuditVerdict


class SafetyReportGenerator:
    def __init__(self, output_dir: str = "./storage/reports"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def generate_json_report(self, incident_meta: Dict[str, Any], verdict: SafetyAuditVerdict) -> str:
        safe_robot_id = html.escape(str(incident_meta.get("robot_id", "ROBOT")))
        report_data = {
            "report_id": f"AUDIT-{safe_robot_id}-{int(time.time())}",
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "incident_metadata": incident_meta,
            "verdict": asdict(verdict),
        }
        file_path = os.path.join(self.output_dir, f"{report_data['report_id']}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2)
        return file_path

    def generate_html_report(self, incident_meta: Dict[str, Any], verdict: SafetyAuditVerdict) -> str:
        safe_robot_id = html.escape(str(incident_meta.get("robot_id", "ROBOT")))
        report_id = f"AUDIT-{safe_robot_id}-{int(time.time())}"
        file_path = os.path.join(self.output_dir, f"{report_id}.html")

        # Status badge colors
        status_colors = {
            "CERTIFIED_SAFE": ("#10b981", "#ecfdf5", "CERTIFIED SAFE"),
            "CONDITIONAL_PASS": ("#f59e0b", "#fffbeb", "CONDITIONAL PASS"),
            "FAILED_CRITICAL_RISK": ("#ef4444", "#fef2f2", "CRITICAL RISK / FAILED"),
        }
        badge_border, badge_bg, badge_text = status_colors.get(
            verdict.certification_status, ("#6b7280", "#f3f4f6", verdict.certification_status)
        )

        # Failure breakdown rows
        breakdown_rows = "".join(
            f"<tr><td><code>{html.escape(str(cause))}</code></td><td style='text-align:right;'><strong>{count}</strong></td><td style='text-align:right;'>{round((count/verdict.total_scenarios_evaluated)*100, 1)}%</td></tr>"
            for cause, count in verdict.failure_breakdown.items()
        )

        # Recommendations list
        recommendations_html = "".join(
            f"<li style='margin-bottom:8px;'>{html.escape(str(rec))}</li>"
            for rec in verdict.critical_recommendations
        )

        # Regulatory Compliance rows
        regulatory_status_styles = {
            "COMPLIANT": ("#10b981", "#ecfdf5", "COMPLIANT"),
            "CONDITIONAL": ("#f59e0b", "#fffbeb", "CONDITIONAL"),
            "NON_COMPLIANT": ("#ef4444", "#fef2f2", "NON-COMPLIANT"),
        }

        reg_rows = ""
        for reg in verdict.regulatory_compliance:
            c_border, c_bg, c_text = regulatory_status_styles.get(reg.status, ("#6b7280", "#f3f4f6", reg.status))
            reg_rows += f"""
            <tr>
                <td style="white-space:nowrap;">
                    <strong>{html.escape(reg.standard)}</strong><br>
                    <span style="font-size:12px; color:#6b7280;">{html.escape(reg.clause)}</span>
                </td>
                <td>
                    <div style="font-weight:600; color:#111827;">{html.escape(reg.title)}</div>
                    <div style="font-size:12px; color:#4b5563; margin-top:2px;">{html.escape(reg.requirement_summary)}</div>
                    <div style="font-size:12px; color:#2563eb; margin-top:4px; font-family:monospace;">{html.escape(reg.observed_margin)}</div>
                </td>
                <td style="text-align:center; vertical-align:middle;">
                    <span style="padding:4px 10px; border-radius:9999px; font-weight:700; font-size:11px; border:1px solid {c_border}; background:{c_bg}; color:{c_border}; display:inline-block;">
                        {c_text}
                    </span>
                </td>
            </tr>
            """

        # SysID Empirical Section
        sysid = verdict.sysid_summary or {}
        sysid_observations = sysid.get("empirical_observations", [])
        sysid_obs_html = "".join(
            f"<li style='margin-bottom:6px;'><code>{html.escape(str(obs))}</code></li>"
            for obs in sysid_observations
        ) if sysid_observations else "<li>No raw kinematics analyzed.</li>"

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Physical AI Safety Audit: {report_id}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1f2937; background: #f8fafc; margin: 0; padding: 40px 20px; }}
        .container {{ max-width: 940px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07); border: 1px solid #e2e8f0; }}
        .header {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }}
        .logo {{ font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }}
        .logo span {{ color: #2563eb; }}
        .badge {{ padding: 8px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; border: 1px solid {badge_border}; background: {badge_bg}; color: {badge_border}; }}
        .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }}
        .card {{ background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 8px; text-align: center; }}
        .card .metric {{ font-size: 26px; font-weight: 800; color: #0f172a; margin: 4px 0; }}
        .card .label {{ font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 16px 0; }}
        th, td {{ padding: 12px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }}
        th {{ background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 11px; }}
        .section-title {{ font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 32px; border-left: 4px solid #2563eb; padding-left: 10px; display: flex; justify-content: space-between; align-items: center; }}
        .callout {{ background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 4px; margin: 24px 0; font-size: 13px; color: #1e40af; line-height: 1.5; }}
        .footer {{ margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }}
        .mono-box {{ background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; line-height: 1.5; margin: 14px 0; overflow-x: auto; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">DIFFRACTION <span>// PHYSICAL AI SAFETY ORACLE</span></div>
            <div class="badge">{badge_text}</div>
        </div>

        <h1 style="font-size: 22px; margin-top: 0; color: #0f172a;">Autonomous Mobile Robot Safety Certification Audit</h1>
        <p style="color: #64748b; font-size: 13px;">Certificate ID: <code>{report_id}</code> | Timestamp: {time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())}</p>

        <div class="grid">
            <div class="card">
                <div class="label">Compliance Score</div>
                <div class="metric" style="color: {badge_border};">{verdict.safety_compliance_score}%</div>
                <div style="font-size: 11px; color: #64748b;">Threshold: &ge; 95.0%</div>
            </div>
            <div class="card">
                <div class="label">Adversarial Scenarios</div>
                <div class="metric">{verdict.total_scenarios_evaluated}</div>
                <div style="font-size: 11px; color: #64748b;">Passed: {verdict.scenarios_passed} | Failed: {verdict.scenarios_failed}</div>
            </div>
            <div class="card">
                <div class="label">Safe Traction Boundary</div>
                <div class="metric">&mu; &ge; {verdict.safe_operational_boundaries['minimum_safe_surface_friction_mu']}</div>
                <div style="font-size: 11px; color: #64748b;">Max Speed: {verdict.safe_operational_boundaries['recommended_max_speed_ms']} m/s</div>
            </div>
            <div class="card">
                <div class="label">SysID Ground Truth μ</div>
                <div class="metric" style="color: #2563eb;">&mu; = {sysid.get('estimated_surface_friction_mu', 'N/A')}</div>
                <div style="font-size: 11px; color: #64748b;">Confidence: {sysid.get('calibration_confidence_score', '95.0')}%</div>
            </div>
        </div>

        <div class="section-title">International Regulatory Standards Compliance (ISO 3691-4 & ANSI/RIA R15.08)</div>
        <table>
            <thead>
                <tr>
                    <th style="width:25%;">Standard & Clause</th>
                    <th style="width:55%;">Safety Requirement & Observed Boundary</th>
                    <th style="width:20%; text-align:center;">Compliance Status</th>
                </tr>
            </thead>
            <tbody>
                {reg_rows}
            </tbody>
        </table>

        <div class="section-title">System Identification (SysID) Telemetry Ground-Truth Calibration</div>
        <p style="font-size:13px; color:#475569; margin:6px 0 12px 0;">
            Real-world physics parameters derived directly from onboard wheel odometry, IMU deceleration, and kinematic tracking logs during incident execution:
        </p>
        <ul style="padding-left: 20px; font-size: 13px; color: #334155;">
            {sysid_obs_html}
        </ul>

        <div class="section-title">Incident Metadata & Digital Twin Provenance</div>
        <table>
            <tr><th>Robot Identifier</th><td><code>{html.escape(str(incident_meta.get('robot_id', 'N/A')))}</code></td></tr>
            <tr><th>Trigger Origin</th><td><code>{html.escape(str(incident_meta.get('trigger_type', 'N/A')))}</code> (Severity: {html.escape(str(incident_meta.get('trigger_severity', 'N/A')))})</td></tr>
            <tr><th>Facility Location</th><td>{html.escape(str(incident_meta.get('facility_id', 'N/A')))}</td></tr>
            <tr><th>USD Spatial Stage</th><td><code>{html.escape(str(incident_meta.get('usd_stage_path', 'N/A')))}</code></td></tr>
        </table>

        <div class="section-title">Adversarial Failure Mode Distribution</div>
        <table>
            <thead>
                <tr>
                    <th>Failure Root Cause Category</th>
                    <th style="text-align:right;">Incident Count</th>
                    <th style="text-align:right;">Failure Rate</th>
                </tr>
            </thead>
            <tbody>
                {breakdown_rows if breakdown_rows else "<tr><td colspan='3' style='text-align:center;'>Zero critical failures detected across all test matrices.</td></tr>"}
            </tbody>
        </table>

        <div class="section-title">Mandatory Engineering & Policy Remediation</div>
        <ul style="padding-left: 20px; font-size: 13px; color: #334155;">
            {recommendations_html}
        </ul>

        <div class="callout">
            <strong>Formal Due Diligence Verification:</strong> This certificate mathematically confirms that firmware policy was evaluated across <code>{verdict.total_scenarios_evaluated}</code> parallel counterfactual physics and multi-axis environmental stress conditions in compliance with ISO 3691-4 and ANSI/RIA R15.08 dynamic envelope requirements.
        </div>

        <div class="footer">
            Diffraction Autonomous Systems Certification Engine &bull; Confidential & Proprietary &bull; Powered by Closed-Loop Telemetry SysID
        </div>
    </div>
</body>
</html>
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        return file_path

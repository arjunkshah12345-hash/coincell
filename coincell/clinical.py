from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ClinicalProtocol:
    urgency: str  # CRITICAL | URGENT | ROUTINE
    color: str
    time_window: str
    actions: list[str]
    contacts: list[str]
    reese_law_note: str


def build_protocol(
    battery_prob: float,
    ambiguous: bool,
    has_lateral: bool,
) -> ClinicalProtocol:
    if battery_prob >= 0.5 or ambiguous:
        actions = [
            "NPO immediately — no food or drink",
            "Stat pediatric surgery / GI consult",
            "Prepare for emergent endoscopy",
            "Two-view series if only AP obtained" if not has_lateral else "Document step-off morphology on lateral",
            "If ambiguous halo: treat as battery until endoscopy rules out",
        ]
        return ClinicalProtocol(
            urgency="CRITICAL",
            color="#dc2626",
            time_window="Target endoscopy within 2 hours of ingestion",
            actions=actions,
            contacts=[
                "Poison Control: 1-800-222-1222",
                "Pediatric emergency attending",
                "National Battery Ingestion Hotline: 202-625-3333",
            ],
            reese_law_note=(
                "Reese's Law (P.L. 117-171) mandated safer battery packaging after pediatric deaths. "
                "CoinCell addresses the remaining diagnostic gap — packaging cannot help after ingestion."
            ),
        )

    if battery_prob >= 0.25:
        return ClinicalProtocol(
            urgency="URGENT",
            color="#d97706",
            time_window="Re-evaluate within 30 minutes; do not discharge without lateral view",
            actions=[
                "Obtain lateral neck/chest radiograph if not done",
                "Continuous monitoring",
                "Low threshold for ENT/GI consult",
            ],
            contacts=["Poison Control: 1-800-222-1222"],
            reese_law_note="Indeterminate disc — err on side of battery protocol per AAP guidelines.",
        )

    return ClinicalProtocol(
        urgency="ROUTINE",
        color="#16a34a",
        time_window="Standard foreign-body pathway",
        actions=[
            "Correlate with clinical history (witnessed coin vs battery)",
            "Serial imaging if object may be esophageal",
            "Discharge only with confirmed gastric location + asymptomatic child",
        ],
        contacts=["Primary pediatrician follow-up"],
        reese_law_note="Features favor coin; confirm with history. Re-image if symptoms develop.",
    )
